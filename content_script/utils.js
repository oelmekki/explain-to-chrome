let useOnThisDomainCallback;

function findLink( element ){
  if ( isLinky( element) ) return element;

  while ( element = element.parentElement ){
    if ( isLinky( element ) ) return element;
  }
}

function isLinky( element ){
  return !! linkishUrl( element );
}

function linkishUrl( element ){
  return element.tagName.toLowerCase() == "a" && element.href || element.dataset.cardUrl;
}

function useOnThisDomain(){
  return new Promise( function( success ){
    useOnThisDomainCallback = success;
    let domain = window.location.href.replace( /https?:\/\/(.*?)\/.*/, '$1' );
    chrome.runtime.sendMessage({ action: "useOnThisDomain", domain: domain });
  });
}

function initContextMenu(){
  let domain = window.location.href.replace( /https?:\/\/(.*?)\/.*/, '$1' );
  chrome.runtime.sendMessage({ action: "initContextMenu", domain: domain });
}

function setStyles( element, styles ){
  Object.keys( styles ).forEach( function( style ){
    element.style[ style ] = styles[ style ];
  }.bind( this ));
}

chrome.runtime.onMessage.addListener( function( request ){
  if ( request.action == "useOnThisDomain" ){
    if ( useOnThisDomainCallback ){
      useOnThisDomainCallback( request );
      useOnThisDomainCallback = null;
    }
  }
});
