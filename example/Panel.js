const langs = [
  'en',
  'zh-CN',
]

const $t = {
  title: { "en": "English", "zh-CN": "中文" },
  parsed: { "en": "Parsed", "zh-CN": "解析后" },
}

class Panel extends React.Component {
  render() {
    const { panel, onLangChange, onTextChange, onSave} = this.props
    return <StyledPanelRoot>
      <h1>{ $t.title[ panel.lang ] }</h1>
      <select onChange={ e => onLangChange( panel, e.target.value ) }>
        {
          langs.map( (lang, index) => <option value={ lang } selected={ lang === panel.lang } key={index}>{ lang }</option> )
        }
      </select>
      <textarea 
        onChange={ e => onTextChange( panel, e.target.value ) } 
        value={ panel.text }
      />
      <div className="buttonWrapper">
        <button onClick={ () => onSave( panel ) }>Save</button>
      </div>
      {/* <strong>{ $t.parsed[ panel.lang ] }</strong> */}
      <div className="parsedBox" >
        {
          parse( panel.parsedText )
        }
      </div>
    </StyledPanelRoot>
  }
}

const StyledPanelRoot = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50%;
  height: 100%;
  padding: 20px;
  font-size: 16px;

  h1 {
    font-size: 20px;
    height: 50px;
    line-height: 50px;
  }

  strong {
    height: 50px;
    margin-top: 100px;
    line-height: 50px;
    color: #999;
  }

  >textarea {
    resize: none;
    box-sizing: border-box;
    margin-top: 20px;
    padding: 8px 8px 36px 8px;
    width: 100%;
    height: 200px;
    max-height: 200px;
    font-size: 16px;
    border-radius: 5px;
    overflow: auto;
  }

  >.buttonWrapper{
    position: relative;

    >button {
     position: absolute;
     top: -30px;
     left: -25px;
     width: 50px;
     height: 20px;
    }
  }
  
  
  >.parsedBox {
    box-sizing: border-box;
    width: 100%;
    height: 100px;
    margin-top: 100px;
    padding: 6px;
    white-space: pre-wrap;
    color: #ddd;
    /* border: 1px solid #ddd; */
    overflow: auto;
  }
`