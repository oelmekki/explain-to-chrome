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

          if ( useIt ){
            document.querySelector( '#status' ).innerText = "summarizing links";
            document.querySelector( "#activate" ).style.display = 'none';
            document.querySelector( "#deactivate" ).style.display = 'inline';
          }

          else {
            document.querySelector( '#status' ).innerText = "not summarizing links";
            document.querySelector( "#activate" ).style.display = 'inline';
            document.querySelector( "#deactivate" ).style.display = 'none';
          }
        });
      });
    });
  }

  bindEvents(){
    document.querySelector( '#activate button' ).addEventListener( 'click', this.activate.bind( this ) );
    document.querySelector( '#deactivate #one-hour' ).addEventListener( 'click', this.deactivateOneHour.bind( this ) );
    document.querySelector( '#deactivate #permanently' ).addEventListener( 'click', this.deactivate.bind( this ) );

    [].forEach.call( document.querySelectorAll( '[type="radio"]' ), radio => {
      radio.addEventListener( 'change', this.changeActivation.bind( this ) );
    });
  }

  activate(){
    this.toggle( true );
  }

  deactivate(){
    this.toggle( false );
  }

  deactivateOneHour(){
    let until = new Date().getTime() + ( 1000 * 60 * 60 );
    this.toggle( until );
  }

  toggle( value ){
    chrome.runtime.getBackgroundPage( ( background ) => {
      background.toggleUse( this.domain, value ).then( this.checkDomain.bind( this ) );
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
