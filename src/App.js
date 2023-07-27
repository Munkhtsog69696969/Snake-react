import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState, useRef } from 'react'; 
import useInterval from "use-interval";


function App() {
  const [mapWidth,setMapWidth]=useState(null);
  const [smallIndex,setSmallIndex]=useState(null);
  const [snake,setSnake]=useState([{top:0,left:0} , {top:0 , left:smallIndex}]);
  const [direction,setDirection]=useState("right");
  const [lastDir,setLastDir]=useState("");
  const [foodEatenCount , setFoodEatenCount]=useState(0);
  const [foodCoordinate,setFoodCoordinate]=useState(null);
  const [timeFrame,setTimeFrame]=useState(500);
  const [dead,setDead]=useState(false);
  const [name,setName]=useState("");

  const highScore=JSON.parse(localStorage.getItem("score"))

  const mapRef=useRef();

  useEffect(()=>{
    setMapWidth(mapRef.current.offsetWidth);
    setSmallIndex(mapRef.current.offsetWidth/10);
    setFoodCoordinate(generateFoodCoordinate(9,1));
  },[]);

  function generateFoodCoordinate(max,min){
    const foodX=Math.floor((Math.random()*(max-min)+min));
    const foodY=Math.floor((Math.random()*(max-min)+min));

    return {x:foodX , y:foodY};
  }

  const RenderFood=()=>{
    return(
      <img
       src='https://wiki.hypixel.net/images/2/20/SkyBlock_items_enchanted_diamond.gif'
       style={{
        width:smallIndex,
        height:smallIndex,
        // backgroundColor:"red",
        position:"absolute",
        top:foodCoordinate?.y*smallIndex,
        left:foodCoordinate?.x*smallIndex
       }}
      />
    )
  }

  useEffect(()=>{
    setFoodCoordinate(generateFoodCoordinate(9,1))
  },[foodEatenCount]);  

  // console.log(snake)

  useInterval(()=>{
    if(dead==false){
      if(direction=="right"){
        if(snake[0].left<smallIndex*9){
          const newSnake=snake.map((snakeEl,i)=>{
            if(i==0){
              return ({top:snakeEl.top , left:snakeEl.left+smallIndex})
            }else{
              return ({top:snake[i-1].top , left:snake[i-1].left})
            }
          });

          setSnake(newSnake)
        }else{
          const newSnake=snake.map((snakeEl,i)=>{
            if(i==0){
              return ({top:snakeEl.top , left:0})
            }else{
              return ({top:snake[i-1].top , left:snake[i-1].left})
            }
          });

          setSnake(newSnake)
        }
      }

      if(direction=="down"){
        if(snake[0].top<smallIndex*9){
          const newSnake=snake.map((snakeEl,i)=>{
            if(i==0){
              return ({top:snakeEl.top+smallIndex , left:snakeEl.left})
            }else{
              return ({top:snake[i-1].top , left:snake[i-1].left})
            }
          });

          setSnake(newSnake)
        }else{
          const newSnake=snake.map((snakeEl,i)=>{
            if(i==0){
              return ({top:0 , left:snakeEl.left})
            }else{
              return ({top:snake[i-1].top , left:snake[i-1].left})
            }
          });

          setSnake(newSnake)
        }
      }

      if(direction=="left"){
        if(smallIndex<=snake[0].left){
          const newSnake=snake.map((snakeEl,i)=>{
            if(i==0){
              return ({top:snakeEl.top , left:snakeEl.left-smallIndex})
            }else{
              return ({top:snake[i-1].top , left:snake[i-1].left})
            }
          });

          setSnake(newSnake)
        }else{
          const newSnake=snake.map((snakeEl,i)=>{
            if(i==0){
              return ({top:snakeEl.top , left:smallIndex*9})
            }else{
              return ({top:snake[i-1].top , left:snake[i-1].left})
            }
          });

          setSnake(newSnake)
        }
      }

      if(direction=="up"){
        if(smallIndex<=snake[0].top){
          const newSnake=snake.map((snakeEl,i)=>{
            if(i==0){
              return ({top:snakeEl.top-smallIndex , left:snakeEl.left})
            }else{
              return ({top:snake[i-1].top , left:snake[i-1].left})
            }
          });

          setSnake(newSnake)
        }else{
          const newSnake=snake.map((snakeEl,i)=>{
            if(i==0){
              return ({top:smallIndex*9 , left:snakeEl.left})
            }else{
              return ({top:snake[i-1].top , left:snake[i-1].left})
            }
          });

          setSnake(newSnake)
        }
      }

      //is food eaten?
      if(snake[0]?.top==foodCoordinate?.y*smallIndex && snake[0]?.left==foodCoordinate?.x*smallIndex){
        setFoodEatenCount(prev=>prev+1);
        setSnake([...snake , {top:snake[snake.length-1].top , left:snake[snake.length-1].left}])
      }

      //snake body colission detection
      snake.map((snakeEl,i)=>{
        if(i!=0){
          if(snake[0].top==snakeEl.top && snake[0].left==snakeEl.left){
            setDead(true);
            setSnake([]);
            setFoodCoordinate()
          }
        }
      })
    }
  },timeFrame);

  console.log(lastDir)
  useEffect(()=>{
    window.addEventListener("keydown",(e)=>{
      if(e.code=="ArrowRight" || e.code=="KeyD"){
        if(lastDir!="left"){
          setDirection("right");
        }
      }
      if(e.code=="ArrowDown" || e.code=="KeyS"){
        setDirection("down");
        setLastDir("down")
      }
      if(e.code=="ArrowLeft" || e.code=="KeyA"){
        setDirection("left");
        setLastDir("left")
      }
      if(e.code=="ArrowUp" || e.code=="KeyW"){
        setDirection("up");
        setLastDir("up")
      }
    })
  },[]);

  function SavePlayerScore(){
    if(name!="" && dead==true){
      const highScore=JSON.parse(localStorage.getItem("score"));

      if(!highScore){
        localStorage.setItem("score" , JSON.stringify({name:name , score:foodEatenCount}));
      }else if(highScore.score<=foodEatenCount){
        localStorage.setItem("score" , JSON.stringify({name:name , score:foodEatenCount}));
      }

      setSnake([{top:0,left:0} , {top:0 , left:smallIndex}]);
      setFoodEatenCount(0);
      setName("");
      setDirection("right");
      setDead(false);
    }
  }

  return (
    <div className={dead ? "deadScreen" : "whole"}>
      <div className={dead ? "deadScore" : "aliveScore"}>
        {foodEatenCount}
        <input placeholder='Your name' onChange={(e)=>{setName(e.target.value)}}/>
        <button onClick={SavePlayerScore}>Save your progress</button>
      </div>
      <div ref={mapRef} className={dead ? "" : "map"}>
        {
          snake && snake.map((snakeEl,i)=>{
            return(
              i==0 ?

              <img 
                src="https://art.pixilart.com/02edfa73c901f6f.png"
                style={{
                  width:smallIndex,
                  height:smallIndex,
                  aspectRatio:1/1,
                  top:snakeEl.top,
                  left:snakeEl.left,
                  position:"absolute"
                }}
                key={i}
              />

              :
              <img 
                src="https://i.pinimg.com/originals/b8/3e/93/b83e9318fff366519793948af85a5af0.png"
                style={{
                  width:smallIndex,
                  height:smallIndex,
                  aspectRatio:1/1,
                  top:snakeEl.top,
                  left:snakeEl.left,
                  position:"absolute"
                }}
                key={i}
              />
            )
          })
        }

        {
          dead ?
          ""
          :
          RenderFood()
        }
      </div>
      <div className="scoreBoard">
        {
          dead ?
          ""
          :
          <div>
            <div>Your score:{foodEatenCount}</div>
            {
              highScore ?
                <div>Highest score by {highScore.name} , score:{highScore.score}</div>
              : ""
            }
          </div>
        }
      </div>
    </div>
  );
}

export default App;
