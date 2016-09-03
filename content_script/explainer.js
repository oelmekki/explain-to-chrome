let popup, bgCallback;

class Explainer {
  constructor( link, url ){
    this.link = link;
    this.url = url;
    this.aborted = false;
  }

  abort(){
    this.aborted = true;
  }

  fetch(){
    this.display( "Loading...", [] );

    let headers = new Headers();
    headers.append( "Content-type", "application/json" );

    this.findDestination( this.url ).then( ( url ) => {
      let body = JSON.stringify({ url: url, max_sent: 5 });
      fetch( 'https://explaintome.herokuapp.com/api/v1.0/summary', { method: 'post', body: body, headers: headers }).then( ( response ) => {
        if ( ! this.aborted ){
          if ( response.ok && response.status == 200 ){
            response.json().then( ( response ) => {
              this.display( response.meta && response.meta.title, response.summary );
            });
          }

          else {
            this.display( "Woops", [ "Sorry, the server is not responding successfully :(" ] );
          }
        }
      });
    });
  }

  display( title, content ){
    if ( popup ) popup.destroy();
    popup = new Popup( title, content );
    popup.onClose = this.abort.bind( this );
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
