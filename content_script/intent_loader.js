class IntentLoader {
  constructor( anchor ){
    this.anchor = anchor;
    this.userIsWilling = true;
  }

  abort(){
    this.userIsWilling = false;
  }

  confirm(){
    return new Promise( function( success ){
      this._load = this.load.bind( this );
      this.success = success;
      this.startingTime = new Date().getTime();
      this.createElement();
      this.interval = setInterval( this._load, 10 );
    }.bind( this ));
  }

  load(){
    let now = new Date().getTime();
    let timeout = 1500;

    if ( this.userIsWilling ){
      let elapsed = now - this.startingTime;
      if ( elapsed > timeout ){
        this.success();
      }

      else {
        let percent = elapsed / timeout * 100;
        this.progress.style.width = `${percent}%`;
      }
    }

    else {
      clearInterval( this.interval );
      this.remove();
    }
  }

  createElement(){
    this.loadContainer = document.createElement( "div" );
    setStyles( this.loadContainer, this.styles() );
    document.body.appendChild( this.loadContainer );

    this.progress = document.createElement( "div" );
    setStyles( this.progress, this.progressStyles() );
    this.loadContainer.appendChild( this.progress );
  }

  remove(){
    this.loadContainer.remove();
  }

  styles(){
    let position = this.anchor.getBoundingClientRect();

    return {
      position: "absolute",
      width: "100px",
      height: "10px",
      backgroundColor: "#fff",
      top: `${position.top + document.body.scrollTop - 15}px`,
      left: `${position.left + document.body.scrollLeft}px`,
      zIndex: 999999,
      border: '1px solid #eaeaea',
      borderRadius: "5px",
      overflow: "hidden",
    };
  }

  progressStyles(){
    return {
      position: "absolute",
      left: 0,
      top: 0,
      width: 0,
      height: "100%",
      backgroundColor: "#888",
    };
  }
}
