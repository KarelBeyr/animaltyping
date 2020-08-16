import React, { Component } from 'react';
import './App.css';
import UIfx from 'uifx'

const bell = new UIfx(require("./res/bump.mp3"))
const applause = new UIfx(require("./res/applause.mp3"))

interface GameState {
  patternIndex: number
  value: string
  overlayDisplay: string
}

interface GameProps {
  patterns: string[]
  known: string[]
}

class Game extends Component<GameProps, GameState> {
  constructor(props: GameProps) {
    super(props);
    this.state = { patternIndex: 0, value: "", overlayDisplay: "hidden" };
    this.next = this.next.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keypress', this.handleKeyPress);
  }
  componentWillUnmount()
  {
    document.removeEventListener('keydown', this.handleKeyDown)
    document.removeEventListener('keypress', this.handleKeyPress)
  }
  render() {
    const pattern = this.props.patterns[this.state.patternIndex]
    return <div className="App" tabIndex={0}>
        <OverlayImage pattern={pattern} className={this.state.overlayDisplay} />
        <div id="imageDiv" >
          <img src={require(`./res/${pattern.toLowerCase()}.jpg`)} alt={pattern} />
        </div>
        <div id="patternAndInput">
          {this.props.known.find(_ => _ === pattern) === undefined ? pattern : ""}
          <br />  
          <InputPage pattern={pattern} value={this.state.value} />
        </div>
      </div>
  }

  handleKeyDown = (e: KeyboardEvent) => {
    if (e.keyCode === 8) {  //backspace
      this.setState({value: this.state.value.slice(0, -1)});
      e.preventDefault();
    }
    bell.play()
  }

  isAlphanum(code: number): boolean {
    return ((code > 47) && (code < 58)) ||
      code === 32 ||
      ((code > 64) && (code < 91)) ||
      ((code > 95) && (code < 123)) //a-z
  }

  next() {
    let newPi = this.state.patternIndex + 1
    if (newPi >= this.props.patterns.length) newPi = 0
    this.setState({patternIndex: newPi, value: "", overlayDisplay: "hidden"});
    const pattern = this.props.patterns[newPi].toLowerCase()
    new UIfx(require(`./res/${pattern}.mp3`)).play()
  }

  handleKeyPress = (e: KeyboardEvent) => {
    if (!this.isAlphanum(e.charCode)) return;

    const newValue = this.state.value + String.fromCharCode(e.charCode).toUpperCase()
    this.setState({value: newValue});
    if (newValue === this.props.patterns[this.state.patternIndex])
    {
      applause.play()

      this.setState({patternIndex: this.state.patternIndex, value: "", overlayDisplay: "show"});
      setTimeout(this.next, 6500)
    }
  }
}

interface OverlayImageProps {
  pattern: string
  className: string
}

export class OverlayImage extends Component<OverlayImageProps> {
  render() {
    return <div className={`overlay ${this.props.className}`}>
      <img src={require(`./res/${this.props.pattern.toLowerCase()}.gif`)} alt={this.props.pattern} />
    </div>
  }
}

interface InputPageProps {
  pattern: string
  value: string
}

export class InputPage extends Component<InputPageProps> {
  render() {
    return <span id="input">
      {this.props.value.split("").map((char, idx) => {
        return <span key={idx} className={this.props.value[idx] === this.props.pattern[idx] ? "ok" : "wrong"}>{ 
          (char === " ") ? '\u00A0' : char    //fix "invisible" double space 
        }</span>
      })}
    </span>
  }
}

const App: React.FC = () => {
  return (
    //"a red dog", "a blue dog", "a green dog"
    <Game patterns={["a dog", "a deer", "a fox", "a giraffe", "a mouse", "a donkey", "a mole", "a cat", "a bird", "a horse", "a snake",
      "a cow", "an elephant", "a fish", "an octopus", "a butterfly", "a lion", "a rabbit",
      "a pig", "a slug", "a snail"].map(_ => _.toUpperCase())} known={[]/*["a dog"].map(_ => _.toUpperCase())*/} 
    />
  );
}

export default App;
