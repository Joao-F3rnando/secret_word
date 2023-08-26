//CSS
import './App.css'

//React
import { useState, useCallback, useEffect } from 'react'

//data
import { wordsList } from './data/words'

//components
import { StartScreen } from './components/StartScreen/StartScreen'
import { Game } from './components/Game/Game'
import { GameOver } from './components/GameOver/GameOver'

const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" }
]

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name)
  const [words] = useState(wordsList)

  const [picketWord, setPicketWord] = useState('')
  const [picketCategory, setPicketCategory] = useState('')
  const [letters, setLetters] = useState([])

  const [guessedLetters, setGessedLetters] = useState([])
  const [wrongLetters, setWrongLetters] = useState([])
  const [guesses, setGuesses] = useState(3)
  const [score, setScore] = useState(0)

  //check if the player lose
  useEffect(() => {
    if (guesses <= 0) {
      setGameStage(stages[2].name)
    }
  }, [guesses])

  //check the player wins
  useEffect(() => {
    const uniqueLetters = [... new Set(letters)]



    if (guessedLetters.length === uniqueLetters.length && guessedLetters.length !== 0) {
      setScore((prev) => prev + 100)

      setGessedLetters([])
      setWrongLetters([])
      if (guesses < 3) {
        setGuesses((prev) => prev + 1)
      }

      startGame()
    }
  }, [guessedLetters])

  //Restart the game
  const retry = () => {
    clean()
    setGameStage(stages[0].name)
  }

  //clean all infos
  const clean = () => {
    setPicketWord('')
    setPicketCategory('')
    setLetters([])
    setGessedLetters([])
    setWrongLetters([])
    setGuesses(3)
    setScore(0)
  }

  const pickWordAndPickCategory = () => {
    //pick a random category
    const categories = Object.keys(words)
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)]
    //pick a random word
    const word = words[category][Math.floor(Math.random() * words[category].length)]

    return { word, category }
  }
  //Start the secret word
  const startGame = useCallback(() => {
    //pick word and pick category
    const { word, category } = pickWordAndPickCategory()

    //Create an array of letters
    let wordLetters = word.split("")
    wordLetters = wordLetters.map((l) => l.toLowerCase())

    //fill states
    setPicketWord(word)
    setPicketCategory(category)
    setLetters(wordLetters)

    setGameStage(stages[1].name)
  })

  //procces the letter input
  const verifyLetter = (letter) => {
    letter = letter.toLowerCase()

    if (guessedLetters.includes(letter) || wrongLetters.includes(letter)) {
      return;
    }

    if (letters.includes(letter)) {
      setGessedLetters((actualState) => [
        ...actualState, letter
      ])
    }
    else {
      setWrongLetters((actualState) => [
        ...actualState, letter
      ])
      setGuesses((guesses - 1))
    }
  }

  return (
    <div className='App'>
      {gameStage === "start" && <StartScreen startGame={startGame} />}
      {gameStage === "game" && <Game
        verifyLetter={verifyLetter}
        picketWord={picketWord}
        picketCategory={picketCategory}
        letters={letters}
        guessedLetters={guessedLetters}
        wrongLetters={wrongLetters}
        guesses={guesses}
        score={score}
      />}
      {gameStage === "end" && <GameOver retry={retry} score={score} />}
    </div>
  )
}

export default App
