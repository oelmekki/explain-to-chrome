class Main {
  constructor(){
    this.useOnDomain = false;
    this.domain = '';
    this.setActivation();
    this.checkDomain();
    this.bindEvents();
  }

  setActivation(){
    chrome.runtime.getBackgroundPage( ( background ) => {
      background.retrieveActivation().then( ( activation ) => {
        document.querySelector( `[name="activation"][value="${activation}"]` ).checked = "checked";
      });
    });
  }

  checkDomain(){
    chrome.runtime.getBackgroundPage( ( background ) => {
      background.retrieveDomain().then( ( domain ) => {
        document.querySelector( "#domain" ).innerText = domain;
        this.domain = domain;

        background.useOnDomain( domain ).then( ( useIt ) => {
          this.useOnDomain = useIt;

          document.querySelector( '#status' ).innerText = useIt ? "summarizing links" : "not summarizing links";
          document.querySelector( 'button' ).innerText = useIt ? "Suspend" : "Activate";
        });
      });
    });
  }

  bindEvents(){
    document.querySelector( 'button' ).addEventListener( 'click', this.toggle.bind( this ) );
    [].forEach.call( document.querySelectorAll( '[type="radio"]' ), radio => {
      radio.addEventListener( 'change', this.changeActivation.bind( this ) );
    });
  }

  toggle(){
    chrome.runtime.getBackgroundPage( ( background ) => {
      background.toggleUse( this.domain, ! this.useOnDomain ).then( this.checkDomain.bind( this ) );
    });
  }

  changeActivation(){
    [].forEach.call( document.querySelectorAll( '[type="radio"]' ), radio => {
      if ( radio.checked ){
        chrome.runtime.getBackgroundPage( ( background ) => background.setActivation( radio.value ) );
      }
    });
  }
}

document.addEventListener( "DOMContentLoaded", () => new Main() );
