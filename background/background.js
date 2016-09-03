/*
 * We need to follow redirect in background page because fetch will fail
 * in content script in case of protocol mismatch
 */
function findDestination( url ){
  return lookup( url );
}

function lookup( url ){
  return new Promise( function( success ){
    fetch( url ).then( function( response ){
      if ( response.status == 301 ){
        lookup( response.location ).then( success );
      }

      else {
        response.text().then( function( content ){
          let match = content.match( /http-equiv="refresh" content=".*?URL=(.*?)"/ );
          if ( match ) lookup( match[1] ).then( success );
          else success( url );
        });
      }
    });
  });
}

function retrieveDomain(){
  return new Promise( function( success ){
    chrome.tabs.query({ active: true, currentWindow: true }, function( tabs ){
      success( tabs[0].url.replace( /https?:\/\/(.*?)\/.*/, '$1' ) );
    });
  });
}

function retrieveActivation(){
  return new Promise( function( success ){
    chrome.storage.local.get( [ 'activation' ], function( response ){
      if ( response.activation ) success( response.activation );
      else success( "hover" );
    });
  });
}

function useOnDomain( domain ){
  return new Promise( function( success ){
    chrome.storage.local.get( [ 'domains' ], function( response ){
      if ( response.domains && response.domains[ domain ] ){
        if ( deferred( response.domains[ domain ] ) ) success( false )
        else success( true );
      }
      else success( false );
    });
  });
}

/*
 * we want to allow deferring execution for one hour
 */
function deferred( value ){
  if ( value === true ) return false;
  return new Date().getTime() < value;
}

function toggleUse( domain, useIt ){
  return new Promise( function( success ){
    chrome.storage.local.get( [ 'domains' ], function( response ){
      let domains = response.domains || {};
      domains[ domain ] = useIt;
      chrome.storage.local.set({ domains: domains });
      success();
    });
  });
}

function setActivation( activation ){
  if ( activation == 'context' ) addContextActions();
  else chrome.contextMenus.removeAll();

  chrome.storage.local.set({ activation: activation });
}

function addContextActions(){
  chrome.contextMenus.removeAll();
  chrome.contextMenus.create({
    id: "Explain to Chrome",
    title: "Summarize article",
    contexts: [ "link" ],
  });

  chrome.contextMenus.onClicked.addListener( summarizeCurrentLink );
}

function summarizeCurrentLink(){
  chrome.tabs.query({ active: true, currentWindow: true }, function( tabs ){
    chrome.tabs.sendMessage( tabs[0].id, { action: "summarizeCurrentLink" });
  });
}

chrome.runtime.onMessage.addListener( function( request ){
  if ( request.action == "findDestination" ){
    findDestination( request.url ).then( function( url ){
      chrome.tabs.query({ active: true, currentWindow: true }, function( tabs ){
        chrome.tabs.sendMessage( tabs[0].id, { action: "foundDestination", url: url });
      });
    });
  }

  if ( request.action == "useOnThisDomain" ){
    useOnDomain( request.domain ).then( function( useIt ){
      retrieveActivation().then( function( activation ){
        chrome.tabs.query({ active: true, currentWindow: true }, function( tabs ){
          chrome.tabs.sendMessage( tabs[0].id, { action: "useOnThisDomain", useIt: useIt, activation: activation });
        });
      });
    });
  }

  if ( request.action == "initContextMenu" ){
    useOnDomain( request.domain ).then( function( useIt ){
      retrieveActivation().then( function( activation ){
        if ( useIt && activation == 'context' ) addContextActions();
      });
    });
  }
});
