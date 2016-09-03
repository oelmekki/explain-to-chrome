class Main {
  constructor(){
    document.body.addEventListener( "mouseenter", this.detect.bind( this ), true );
    this._cancelIntent = this.cancelIntent.bind( this );
    initContextMenu();
  }

  detect( event ){
    useOnThisDomain().then( ( usage ) => {
      if ( usage.useIt ){
        let link = findLink( event.target );
        if (  link && linkishUrl( link ).match( /^(https?:\/\/|\/)/ ) ){
          this.explainElement = link;
          if ( usage.activation == 'hover' ) this.checkIntent();
        }
      }
    });
  }
  
  checkIntent(){
    clearTimeout( this.explainTimeout );
    this.explainTimeout = setTimeout( () => {
      if ( this.loader ) this.loader.abort();
      this.loader = new IntentLoader( this.explainElement );
      this.loader.confirm().then( this.explain.bind( this ));
    }, 1000 );

    this.explainElement.addEventListener( "mouseleave", this._cancelIntent, false );
  }

  explain(){
    if ( this.explainer ) this.explainer.abort();
    this.explainer = new Explainer( this.explainElement, linkishUrl( this.explainElement ) );
    this.loader && this.loader.remove();
    this.explainer.fetch();
  }

  cancelIntent( event ){
    this.loader && this.loader.abort();
    if ( event.target == this.explainElement ) clearTimeout( this.explainTimeout );
    this.explainElement.removeEventListener( "mouseleave", this._cancelIntent, false );
  }
}

chrome.runtime.onMessage.addListener( function( request ){
  if ( request.action == "summarizeCurrentLink" ){
    main.explain();
  }
});

let main = new Main();
