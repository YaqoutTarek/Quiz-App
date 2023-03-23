let countSpan = document.querySelector(`.count span `)
let spanContainer = document.querySelector(`.bullets .spans`)
let quizArea= document.querySelector(`.quiz-area`)
let answersArea= document.querySelector(`.answers-area`)
let submit = document.querySelector(`.submit-button`)
let bullets = document.querySelector(`.bullets`)
let resultContainer = document.querySelector(`.results`)
let countdownElement = document.querySelector(`.countdown`)

let currentIndex=0;
let rightAnswers=0;
let wrongAnswers=0;

function getQuestions() {
    let myRequest = new XMLHttpRequest();
    myRequest.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            console.log(this.responseText)
            let questionsObject = JSON.parse(this.responseText)
            let questionsCount = questionsObject.length;
            createBullets(questionsCount)
            addQuestionData(questionsObject[currentIndex],questionsCount)
            countdown(5,questionsCount)
            submit.onclick = ()=> {
                let rightAnswer= questionsObject[currentIndex].right_answer
                currentIndex++;
                checkAnswer(rightAnswer,questionsCount)
                quizArea.innerHTML=``
                answersArea.innerHTML=``
                addQuestionData(questionsObject[currentIndex],questionsCount)
                bulletHandel()
                clearInterval(countdownInterval)
                countdown(5,questionsCount)
                showResults(questionsCount)
            }
        }
    }
    myRequest.open(`GET`,`html_questions.json`,true)
    myRequest.send()

}
getQuestions()

function createBullets(num) {
    countSpan.innerHTML = num;
    for (i=0; i<num; i++) {
        let span = document.createElement(`span`)
        spanContainer.appendChild(span)
        if (i===0) {
            span.className=`on`
        }
    }
}

function addQuestionData(obj,count) {
    if (currentIndex < count) {
        let questionTitle = document.createElement(`h2`)
        let questionText = document.createTextNode(obj.title)
        questionTitle.appendChild(questionText)
        quizArea.appendChild(questionTitle)
        
        
        for (i=1; i<=4; i++) {
        let questionAnswerDiv= document.createElement(`div`)
        questionAnswerDiv.className=`answer`
        let input= document.createElement(`input`)
        input.setAttribute(`type`,`radio`)
        input.setAttribute(`name`,`question`)
        input.setAttribute(`id`,`answer_${i}`)
        input.dataset.answer = obj[`answer_${i}`]
        let label = document.createElement(`label`)
        label.setAttribute(`for`,`answer_${i}`)
        label.innerHTML=`${obj[`answer_${i}`]}`
        if (i===1) {
            input.checked= true
        }
        questionAnswerDiv.appendChild(input)
        questionAnswerDiv.appendChild(label)
        answersArea.appendChild(questionAnswerDiv)
        }
    }
}

function checkAnswer(rAnswer,qCount) {
    let allAnswers= document.getElementsByName(`question`)
    let chosenAnswer;
    for (i=0;i<4;i++) {
        if (allAnswers[i].checked) {
            chosenAnswer=allAnswers[i].dataset.answer
        }
    }
    if (rAnswer===chosenAnswer) {
        rightAnswers++

    } else {
        wrongAnswers++
    }

}

function bulletHandel() {
    let bulletSpans= document.querySelectorAll(`.bullets .spans span`)
    let arrayOffSpans= Array.from(bulletSpans)
    arrayOffSpans.forEach((span,index)=> {
        if (index === currentIndex) {
            span.className=`on`
        }
    })
}

function showResults(count) {
    let theResults;
    if (currentIndex === count) {
        quizArea.remove()
        answersArea.remove()
        submit.remove()
        bullets.remove()
        if ( rightAnswers === count) {
            theResults = `<span class="perfect">Perfect</span> All Answers Is Right`
        } else if ( rightAnswers > (count/2) && rightAnswers < count) {
            theResults = `<span class="good">Good</span> ${rightAnswers} from ${count} , Wrong answers is ${wrongAnswers}`
        } else {
            theResults = `<span class="bad">Bad</span> ${rightAnswers} from ${count} , Wrong answers is ${wrongAnswers}`
        }
        resultContainer.innerHTML = theResults
    }
}

function countdown(duration,count) {
    if (currentIndex <count) {
        let minutes, seconds;
        countdownInterval = setInterval(function (){
            minutes = parseInt(duration/60);
            seconds = parseInt(duration%60);
            minutes = minutes < 10 ? `0${minutes}`: minutes;
            seconds = seconds < 10 ? `0${seconds}`: seconds;
            countdownElement.innerHTML = `${minutes}:${seconds}`
            if (--duration <0) {
                clearInterval (countdownInterval)
                submit.click()
            }
        }, 1000)
    }
}
