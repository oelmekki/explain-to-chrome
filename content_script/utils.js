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


function setStyles( element, styles ){
  Object.keys( styles ).forEach( function( style ){
    element.style[ style ] = styles[ style ];
  }.bind( this ));
}
