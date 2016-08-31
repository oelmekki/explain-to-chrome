class Positioner {
  constructor( anchor, popup ){
    let position = anchor.getBoundingClientRect();
    this.elPos = { top: position.top + document.body.scrollTop , left: position.left + document.body.scrollLeft };
    this.anchor = anchor;
    this.popup = popup;
    this.position = {};
  }

  call(){
    this.setPosition();
    this.setHorizontal();
    this.setVertical();
  }

  setPosition(){
    this.leftRight = this.elPos.left - document.body.scrollLeft < window.innerWidth / 2 ? 'right' : 'left';
    this.topBottom = this.elPos.top - document.body.scrollTop < window.innerHeight / 2 ? 'bottom' : 'top';

    [ this.position.top, this.position.left ] = [ this.elPos.top, this.elPos.left + 15 ];
    setStyles( this.popup, { top: this.position.top, left: this.position.left });
  }

  setHorizontal(){
    let availableWidth;

    if ( this.leftRight == 'right' ){
      availableWidth = window.innerWidth - this.elPos.left - 25;
      [ this.position.left, this.position.width ] = [ this.elPos.left, Math.min( 750, availableWidth ) ];
    }
    else {
      availableWidth = this.elPos.left - 50;
      let width = Math.min( 750, availableWidth );
      [ this.position.left, this.position.width ] = [ this.elPos.left - width, width ];
    }

    setStyles( this.popup, { left: `${this.position.left}px`, width: `${this.position.width}px` });
  }

  setVertical(){
    let height, availableHeight;

    let scrollHeight = this.popup.scrollHeight || this.popup.offsetHeight;

    if ( this.topBottom == 'bottom' ){
      availableHeight = window.innerHeight - this.elPos.top - 25;
      height = Math.min( scrollHeight + 10, availableHeight );
      [ this.position.top, this.position.height ] = [ this.elPos.top + 25, height ];
    }
    else {
      availableHeight = this.elPos.top - 50;
      height = Math.min( scrollHeight, availableHeight );
      [ this.position.top, this.position.height ] = [ this.elPos.top - height - 25, height ];
    }

    setStyles( this.popup, { top: `${this.position.top}px`, height: `${this.position.height}px` });
  }
}
