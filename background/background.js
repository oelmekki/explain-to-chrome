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
          if ( match ){
            lookup( match[1] ).then( success );
          }

          else {
            success( url );
          }
        });
      }
    });
  });
}

chrome.runtime.onMessage.addListener( function( request ){
  if ( request.action == "findDestination" ){
    findDestination( request.url ).then( function( url ){
      chrome.tabs.query({ active: true, currentWindow: true}, function( tabs ){
        chrome.tabs.sendMessage( tabs[0].id, { action: "foundDestination", url: url });
      });
    });
  }
});
