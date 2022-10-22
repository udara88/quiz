import axios from 'axios'
import React, { useState, useContext, useEffect } from 'react'

const table = {
  sports: 21,
  history: 23,
  politics: 24,
}

const API_ENDPOINT = 'https://opentdb.com/api.php?'

const url = ''
const tempUrl =
  'https://opentdb.com/api.php?amount=10&category=21&difficulty=easy&type=multiple'

const AppContext = React.createContext()

const AppProvider = ({ children }) => {

  const [waiting,setWaiting] = useState(true)
  const [loading, setLoading] = useState(true)
  const [questions, setQuestions] = useState([])
  const [index, setIndex] = useState(0)
  const [correct, setCorrect]  = useState(0)
  const [error, setError] = useState(false)
  const [quiz,setquiz] =  useState({
    amount:10,
    category:'sports',
    difficulty:'easy' 
  })  

  const [isModalOpen,setIsModalOpen] = useState(false)



  const fetchQuestions = async (url) => {
    setLoading(true)
    setWaiting(false)
    const response = await axios(url).catch((err) => console.log(err))
    if (response) {
      const data = response.data.results
      if (data.length > 0) {
        setQuestions(data)
        setWaiting(false)
        setLoading(false)
        
        setError(false)
      } else {
        setWaiting(true)
        setError(true)
      }
    } else {
      setWaiting(true)
    }
  } 


  


  // useEffect(()=>{

  //   fetchQuestions(tempUrl)

  // },[])


 const nextQuestion = ()=>{
     
 
    setIndex((prevIndex)=>{
    
      let newIndex = prevIndex + 1 
      if (newIndex > questions.length -1 ) {
        openModal();
        return prevIndex
        
      }else{
           return newIndex
      }


   
     })
  }

  
 const checkAnswer = (answer) =>{

  if (answer) {
     
    setCorrect((oldState)=> {return oldState + 1 } )
    nextQuestion()

  }else{
   nextQuestion()
  }

 }

 const openModal = ()=>{
  setIsModalOpen(true)
 }


 const closeModal = ()=>{
  setWaiting(true);
  setIsModalOpen(false)
  setCorrect(0)
 }


 const handleChange = (e) =>{

  const name = e.target.name
  const value = e.target.value

  setquiz({...quiz,[name]:value})

 }

 const handleSubmit = (e)=>{
  e.preventDefault()

  const tempUrl =
  'https://opentdb.com/api.php?amount=10&category=21&difficulty=easy&type=multiple'

  const url = `${API_ENDPOINT}amount=${quiz.amount}&category=${table[quiz.category]}&difficulty=${quiz.difficulty}`
  fetchQuestions(url)

 }


  return <AppContext.Provider value={{waiting,loading,questions,index,correct,error,nextQuestion,isModalOpen,checkAnswer,closeModal,quiz,handleChange,handleSubmit}}>{children}</AppContext.Provider>
}
// make sure use
export const useGlobalContext = () => {
  return useContext(AppContext)
}

export { AppContext, AppProvider }
