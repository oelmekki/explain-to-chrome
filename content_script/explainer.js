let popup, bgCallback;

class Explainer {
  constructor( link, url ){
    this.link = link;
    this.url = url;
  }

  fetch(){
    this.display( "Loading...", [] );

    let headers = new Headers();
    headers.append( "Content-type", "application/json" );

    this.findDestination( this.url ).then( function( url ){
      let body = JSON.stringify({ url: url, max_sent: 5 });
      fetch( 'https://explaintome.herokuapp.com/api/v1.0/summary', { method: 'post', body: body, headers: headers }).then( function( response ){
        response.json().then( function( response ){
          this.display( response.meta && response.meta.title, response.summary );
        }.bind( this ));
      }.bind( this ));
    }.bind( this ));
  }

  display( title, content ){
    if ( popup ) popup.destroy();
    popup = new Popup( title, content );
    popup.showNextTo( this.link );
  }

  findDestination( url ){
    return new Promise( function( success ){
      bgCallback = success;
      chrome.runtime.sendMessage({ action: "findDestination", url: url });
    });
  }
}

chrome.runtime.onMessage.addListener( function( request ){
  if ( request.action == "foundDestination" ){
    if ( bgCallback ){
      bgCallback( request.url );
      bgCallback = null;
    }
  }
});
