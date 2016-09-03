let loader, explainer;

class Main {
  constructor(){
    document.body.addEventListener( "mouseenter", this.detect.bind( this ), true );
  }

  detect( event ){
    useOnThisDomain().then( function( letsGo ){
      if ( letsGo ){
        let link = findLink( event.target );
        if (  link && linkishUrl( link ).match( /^(https?:\/\/|\/)/ ) ){
          this.explain( link );
        }
      }
    }.bind( this ));
  }

  explain( link ){
    clearTimeout( this.explainTimeout );
    this.explainElement = link;

    this.explainTimeout = setTimeout( function(){
      if ( loader ) loader.abort();
      loader = new IntentLoader( link );
      loader.confirm().then( function(){
        if ( explainer ) explainer.abort();
        explainer = new Explainer( link, linkishUrl( link ) );
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
