class Main {
  constructor(){
    document.body.addEventListener( "mouseenter", this.detect.bind( this ), true );
  }

  detect( event ){
    let link = findLink( event.target );
    if (  link && linkishUrl( link ).match( /^(https?:\/\/|\/)/ ) ){
      this.explain( link );
    }
  }

  explain( link ){
    let loader;

    clearTimeout( this.explainTimeout );
    this.explainElement = link;

    this.explainTimeout = setTimeout( function(){
      loader = new IntentLoader( link );
      loader.confirm().then( function(){
        let explainer = new Explainer( link, linkishUrl( link ) );
        loader.remove();
        explainer.fetch();
      });
    }, 1000 );

    link.addEventListener( "mouseleave", function( event ){
      loader && loader.abort();
      if ( event.target == this.explainElement ){
        clearTimeout( this.explainTimeout );
      }
    }.bind( this ));
  }
}

new Main();
