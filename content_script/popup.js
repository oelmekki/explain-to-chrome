class Popup {
  constructor( title, content ){
    this.title = title;
    this.content = content;
    this.onClose = function(){};
    this.build();
  }

  build(){
    this.element = document.createElement( "div" );

    setStyles( this.element, styles.container );
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
    setStyles( header, styles.header );
    header.appendChild( title );

    let closeLink = document.createElement( 'a' );
    closeLink.innerText = "close";
    closeLink.style.cursor = 'pointer';
    closeLink.style.float = 'right';
    header.appendChild( closeLink );

    this.viewport = document.createElement( 'div' );
    setStyles( this.viewport, styles.viewport );
    this.element.appendChild( this.viewport );

    closeLink.addEventListener( 'click', this.destroy.bind( this ), false );
  }

  addContent(){
    let title = document.createElement( 'p' );
    title.innerText = this.title;
    setStyles( title, { fontSize: "24px", marginBottom: "20px" });
    this.viewport.appendChild( title );

    this.content.forEach( text => {
      let paragraph = document.createElement( 'p' );
      paragraph.innerText = text;
      paragraph.style.marginBottom = "15px";
      this.viewport.appendChild( paragraph );
    });
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
  container: {
    display: "none",
    backgroundColor: "#fff",
    position: "absolute",
    width: "250px",
    height: "300px",
    border: '1px solid #ccc',
    zIndex: '9999999',
    overflow: 'hidden',
  },

  header: {
    position: 'absolute',
    boxSizing: "border-box",
    height: '50px',
    width: '100%',
    padding: "15px 10px",
    zIndex: 2,
    top: 0,
    left: 0,
    borderBottom: '1px solid #eaeaea',
  },

  viewport: {
    position: 'absolute',
    boxSizing: "border-box",
    width: '100%',
    height: '250px',
    zIndex: 1,
    top: 0,
    left: 0,
    marginTop: '50px',
    padding: '15px 10px',
    overflowY: "auto",
  }
};
