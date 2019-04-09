const translate = async ( text, from, to ) => {
  const sourceText = text.replace(/ /g, '+')
  const getBingData = items => items[ 0 ].TranslatedText
  const result = await fetch( `http://api.microsofttranslator.com/v2/ajax.svc/TranslateArray?appId=%22TqOrM_WFlaIA2buMr3Omi1ZLbFtmfyHmEIxxPAABFSMc*%22&texts=[%22+${sourceText}+%22]&from=%22${from}%22&to=%22${to}%22&oncomplete=getBingData` ).then( response => response.text() )
  const data = eval( result )
  return data
}

const parse = text => {
  const model = new TextModel.default( text )
  return model.convertedText
}

class App extends React.Component {
  state = {
    panels: [
      {
        lang: 'zh-CN',
        text: `<>苹果<><>Apple<>
        test`,
        parsedText: '',
      },
      {
        lang: 'en',
        text: '',
        parsedText: '',
      },
    ]
  }

  handlePanelLangChange = ( panel, lang ) => {
    this.setState( prevState => ({
      ...prevState,
      panels: prevState.panels.map( v => {
        if ( v === panel ) {
          return { ...v, lang }
        }
        return v
      } )
    }) )
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
        newPanels.push( { ...current, text: referringTextModel.text, parsedText: parse( referringTextModel.text ) } )
      }
      if ( current !== panel ) {
        const currentTextModel = new TextModel.default( current.text, { isRoot : true, enableTranslation: true } )
        await currentTextModel.updateByReferring( referringTextModel, text => translate( text, panel.lang, current.lang ) )
        await currentTextModel.updateYaml( referringTextModel )
        newPanels.push( { ...current, text: currentTextModel.text, parsedText: parse( currentTextModel.text ) } )
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
    return <StyledAppRoot>
      {
        this.state.panels.map( ( panel, index ) => <Panel 
          panel={ panel } 
          onLangChange={ this.handlePanelLangChange } 
          onTextChange={ this.handlePanelTextChange } 
          onSave={ this.handlePanelSave } 
          key={ index }
        /> )
      }
    </StyledAppRoot>
  }
}

const StyledAppRoot = styled.div`
  display: flex;
  height: 100%;
`

ReactDOM.render(
  <App/>,
  document.getElementById('root')
);

