const translate = async ( text, from, to ) => {
  const sourceText = text.replace(/ /g, '+')
  const getBingData = items => items[ 0 ].TranslatedText
  const result = await fetch( `http://api.microsofttranslator.com/v2/ajax.svc/TranslateArray?appId=%22TqOrM_WFlaIA2buMr3Omi1ZLbFtmfyHmEIxxPAABFSMc*%22&texts=[%22+${sourceText}+%22]&from=%22${from}%22&to=%22${to}%22&oncomplete=getBingData` ).then( response => response.text() )
  const data = eval( result )
  return data
}

class App extends React.Component {
  state = {
    panels: [
      {
        lang: 'zh-CN',
        text: '<>苹果<>'
      },
      {
        lang: 'en',
        text: ''
      },
    ]
  }

  handlePanelTextChange = ( panel, value ) => {
    this.setState( prevState => ({
      ...prevState,
      panels: prevState.panels.map( v => {
        if ( v === panel ) {
          return { ...v, text: value }
        }
        return v
      } )
    }) )
  }

  getNewState = async( prevState, panel ) => {
    const referringTextModel = new TextModel.default( panel.text, { isRoot : true, enableTranslation: true } )
    referringTextModel.convertPlaceholderSectionsToSections()
    let newPanels = []
    for ( const current of prevState.panels ) {
      if ( current === panel ) {
        newPanels.push( { ...current, text: referringTextModel.text } )
      }
      if ( current !== panel ) {
        const currentTextModel = new TextModel.default( current.text, { isRoot : true, enableTranslation: true } )
        await currentTextModel.updateByReferring( referringTextModel, text => translate( text, panel.lang, current.lang ) )
        await currentTextModel.updateYaml( referringTextModel )
        console.log( currentTextModel.text )
        newPanels.push( { ...current, text: currentTextModel.text } )
      }
    }

    return {
      ...prevState,
      panels: newPanels
    }
      
  }

  handlePanelSave = async ( panel ) => {
    const newState = await this.getNewState( this.state, panel )
    this.setState( () => ( { ...newState } ) )
  }

  render() {
    return <div>
      {
        this.state.panels.map( ( panel, index ) => <Panel 
          panel={ panel } 
          onTextChange={ this.handlePanelTextChange } 
          onSave={ this.handlePanelSave } 
          key={ index }
        /> )
      }
    </div>
  }
}

class Panel extends React.Component {
  render() {
    const { panel, onTextChange, onSave} = this.props
    return <div>
      <h1>{ panel.lang }</h1>
      <textarea 
        onChange={ e => onTextChange( panel, e.target.value ) } 
        value={ panel.text }
      />
      <button onClick={ () => onSave( panel ) }>Save</button>
    </div>
  }
}

ReactDOM.render(
  <App/>,
  document.getElementById('root')
);

