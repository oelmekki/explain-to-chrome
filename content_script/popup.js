class Popup {
  constructor( title, content ){
    this.title = title;
    this.content = content;
    this.onClose = function(){};
    this.build();
  }

  build(){
    this.element = document.createElement( "div" );

    setStyles( this.element, styles );
    this.addHeader();
    this.addContent();

    document.body.appendChild( this.element );
  }


  addHeader(){
    let header = document.createElement( 'p' );
    setStyles( header, { marginBottom: "20px" });
    this.element.appendChild( header );

    let title = document.createElement( "span" );
    title.innerText = "ExplainToMe for Chrome";
    header.appendChild( title );

    let closeLink = document.createElement( 'a' );
    closeLink.innerText = "close";
    closeLink.style.cursor = 'pointer';
    closeLink.style.float = 'right';
    header.appendChild( closeLink );

    closeLink.addEventListener( 'click', this.destroy.bind( this ), false );
  }

  addContent(){
    let title = document.createElement( 'p' );
    title.innerText = this.title;
    setStyles( title, { fontSize: "24px", marginBottom: "20px" });
    this.element.appendChild( title );

    this.content.forEach( function( text ){
      let paragraph = document.createElement( 'p' );
      paragraph.innerText = text;
      paragraph.style.marginBottom = "15px";
      this.element.appendChild( paragraph );
    }.bind( this ));
  }

  showNextTo( anchorElement ){
    let positioner = new Positioner( anchorElement, this.element );
    this.element.style.display = "block";
    positioner.call();
  }

  destroy(){
    this.element.remove();
    this.onClose();
  }
}

let styles = {
  display: "none",
  backgroundColor: "#fff",
  padding: "15px 10px",
  position: "absolute",
  width: "250px",
  height: "250px",
  border: '1px solid #ccc',
  zIndex: '9999999',
  overflowY: "auto",
};
