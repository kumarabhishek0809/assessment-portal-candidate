import React, { Component, useEffect, useRef } from 'react'
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Button from '@material-ui/core/Button';
import { Typography } from '@material-ui/core';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';


// Logo's On Submit Page
import red_logo from "assets/img/red.png";
import green_logo from "assets/img/green.png";

import endPoint from '../../variables/app.url'
import styles from './QuestionManagement.module.css'

export default function QuestionManagement(props) {
    const [questions, setQuestions] = React.useState([]);
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const [count, setCount] = React.useState(1);
    const [technology, setTechnology] = React.useState('');
    const [questionsCount, setQuestionsCount] = React.useState('');
    const [nextDisable, setNextDisable] = React.useState(false);
    const [preDisable, setPrevDisable] = React.useState(true);
    const [value, setValue] = React.useState('');
    const [answers, setAnswer] = React.useState({});
    const [email, setEmail] = React.useState();
    const [isDataLoaded, setisDataLoaded] = React.useState(false);
    const [isTestSubmitted, setIsTestSubmitted] = React.useState(false);
    let submitButton = useRef(null);
    const [isSubmitClicked, setIsSubmitClicked] = React.useState(false);

    const [queId, setQuesId] = React.useState(0);

    document.onkeydown = capturekey;    
    document.onkeypress = capturekey;
    document.onkeyup = capturekey;
    function capturekey(e) {
        e = e || window.event;
        if(e.code =='F5') {
            if(window.confirm('Do you want to submit test??')) {
                submitButton.current.click();
            } else {
                e.preventDefault();
                e.stopPropagation()
            }
        }
    }

    
    const next = (event) => {
        
        if (questions.length > 0 && questions.length == count + 1) {
            setNextDisable(true);
        }
        
        setCount(count + 1);
        setPrevDisable(false);
        const index = selectedIndex + 1
        setSelectedIndex(index);

        const queIdTemp = questions[index].id
        setQuesId(queIdTemp);
        if (answers[queIdTemp]) {
            setValue(answers[queIdTemp].optionId);
        }

    };
    const prev = (event) => {

        if (questions.length > 0 && count == 2) {
            setPrevDisable(true);
        }
        setCount(count - 1)
        setNextDisable(false);
        const index = selectedIndex - 1;
        setSelectedIndex(index)

        setNextDisable(false);

        const queIdTemp = questions[index].id
        setQuesId(queIdTemp);
        if (answers[queIdTemp]) {
            setValue(answers[queIdTemp].optionId);
        }
    };
    const submit = () => {
        setIsSubmitClicked(true);

        console.log('answers------',answers);

        const result =  Object.values(answers).reduce((acc, answer) => {
            acc.push(answer);
            return acc;
        },[]);

        result.pop();//Remove last blank array element
        let tempId = result[result.length-1]; //Extract the assessmentId and store in temp var
        result.pop(); //Remove assessmentId/last element
        const tempAnswers = { "assessmentId": tempId, "questionAnswerReq":result}; //Form the Object

        //console.log('...........', result);
        console.log(tempAnswers);


        fetch(`${endPoint.serviceEndPoint}submitAssessment?emailId=`+email, {
            method:'POST',
            headers:{
              'Accept':'application/json',
              'Content-Type':'application/json',
              'Access-Control-Allow-Origin': 'Origin, X-Requested-With, Content-Type, Accept'
            },
            body: JSON.stringify(tempAnswers)
          }).then((res)=>res.json())
            .then((res) =>{
                console.log("submitAssessment",res);
                if(res.dataSubmited){
                    setIsTestSubmitted(true);
                }
                
        })

    }
    const handleChange = (event) => {
        
        setValue(event.target.value);
        const questionId = questions[selectedIndex].id
        setQuesId(questionId);

        answers[questionId] = {
            "questionId": questionId,
            "optionId": event.target.value,
            "selected":selectedIndex
        }
        //console.log('answers =>', answers);
        setAnswer(answers);
    };

    useEffect(() => callApi(), []);


const callApi=()=>{
    fetch(`${endPoint.serviceEndPoint}assessment/`+props.history.location.search, {
        method:'GET',
        headers:{
          'Accept':'application/json',
          'Content-Type':'application/json',
          'Access-Control-Allow-Origin': 'Origin, X-Requested-With, Content-Type, Accept'
        }
      }).then((res)=>res.json())
            .then((res) => {
                if (res.dataAvailable) {
                    setQuestions(res.assessments.questions);
                    setTechnology(res.assessments.technology);
                    setEmail(res.candidate.emailAddress);
                    setAnswer({ "assessmentId": res.assessments.id, "questionAnswerReq": [] });
                    setQuestionsCount(res.assessments.noOfQuestions);

                    setQuesId(res.assessments.questions[0].id);
                    setAssessmentTimer(res.assessments.duration);
                }
                setisDataLoaded(true);
            })
    }

    const setAssessmentTimer = (timeInMinutes) => {
        const time = timeInMinutes * 60 * 1000;

        function startTimer(duration, display) {
            var timer = duration, minutes, seconds;

           var getReady = setInterval(quizTimer, 1000);

            function quizTimer () {
                minutes = parseInt(timer / 60, 10);
                seconds = parseInt(timer % 60, 10);

                minutes = minutes < 10 ? "0" + minutes : minutes;
                seconds = seconds < 10 ? "0" + seconds : seconds;

                display.textContent = minutes + ":" + seconds;

                if (--timer < 0) {
                    timer = duration;
                    console.log("Time Up");
                    submitButton.current.click();
                    clearInterval(getReady);
                }
            };
        }

        var quizDuration = 60 * timeInMinutes,
        display = document.querySelector('#time');
        startTimer(quizDuration, display);

    }

    const radioButtonContent = () => {
        return (
            questions[selectedIndex].options.map((option, index) => (
                <FormControlLabel value={option.id} control={<Radio />} label={option.description} />
            ))
        )
    }

    return (
        <div>
            {!isTestSubmitted && isDataLoaded && !questions.length &&
            <GridItem xs={12} sm={12} md={12} style={{alignItems: 'center' }}>
                <Card>
                    <CardHeader color="primary">
                        <Typography variant="h6">
                            <span> 
                                No Active Assignment...
                            </span>
                        </Typography>
                    </CardHeader>
                    <CardBody>
                        <div style={{textAlign: 'center', padding: "50px" }}>
                            <FormControl component="fieldset">
                                    <FormLabel component="legend">
                                        <div>
                                            <img src={red_logo} style={{width : '5%' }} />
                                        </div><br/>
                                        <p style={{color : '#AAAAAA', lineHeight: "2" }}>                                   
                                            There is not any active assignment assigned to you. <br/>
                                            Please contact recruiter.
                                        </p>
                                    </FormLabel>                                    
                            </FormControl>
                        </div>
                    </CardBody>
                </Card>
            </GridItem>}
            {isTestSubmitted && 
            <GridItem xs={12} sm={12} md={12}>
            <Card>
                <CardHeader color="primary">
                    <Typography variant="h6">
                        <span>
                            Test Submitted Successfully !!!
                        </span>
                    </Typography>
                </CardHeader>
                <CardBody>
                    <div style={{textAlign: 'center', padding: "50px" }}>
                        <FormControl component="fieldset">
                            <FormLabel component="legend">
                            <div>
                                <img src={green_logo} style={{width : '5%' }} />
                            </div><br/>
                            <p style={{color : '#AAAAAA',  lineHeight: "2" }}> 
                              Your test has been submitted successfully.<br/> 
                              We wish you good luck. <br/>
                              If you are shortlisted our recruiter team will get in touch with you. <br/>
                              Thanks.
                            </p>
                            </FormLabel>                                    
                      </FormControl>
                   </div>
                </CardBody>
            </Card>
        </GridItem>}
           {!isTestSubmitted && questions.length > 0 && <GridContainer>

                <GridItem xs={12} sm={12} md={12}>
                    <Card>
                        <CardHeader color="primary">
                            <Typography variant="h6">
                                Technology - {technology}
                                <span className={styles.toright}>Assessment will end in <span id="time" className={styles.quiztimer}>00:00</span> minutes!</span>
                            </Typography>
                            
                        </CardHeader>
                        <CardBody>
                            <div>
                                <Typography variant="h6" mt={8}>
                                    {count}. {questions[selectedIndex].header}
                                </Typography>
                                <FormControl component="fieldset">
                                    <FormLabel component="legend"></FormLabel>
                                    <RadioGroup aria-label="question" name="question" value={value} onChange={handleChange}>
                                        {
                                            questions[selectedIndex].options.map((option, index) => 
                                                (<FormControlLabel key={index} checked={String(option.id) == String(value)} value={option.id} control={<Radio />} label={option.description} />)
                                            )
                                        }
                                    </RadioGroup>
                                </FormControl>

                            </div>
                        </CardBody>
                    </Card>
                    <div className={styles.align_buttons}>
                        <Button className={styles.button_margin}
                            type="button"
                            variant="contained"
                            color="secondary"
                            size="large"
                            disabled={preDisable}
                            onClick={() => prev()}
                        >
                            Prev
                  </Button>
                        <Button className={styles.button_margin}
                            type="button"
                            variant="contained"
                            color="secondary"
                            size="large"
                            disabled={nextDisable}
                            onClick={() => next()}
                        >
                            Next
                  </Button>
                        <Button className={styles.button_margin}
                            type="button"
                            variant="contained"
                            color="secondary"
                            size="large"
                            id = "btn-submit"
                            disabled={isSubmitClicked}
                            ref={submitButton}
                            onClick={() => submit()}
                        >
                            submit
                  </Button>
                    </div>
                </GridItem>
            </GridContainer>}
        </div>)
};