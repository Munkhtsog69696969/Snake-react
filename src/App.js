import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState, useRef } from 'react'; 
import useInterval from "use-interval"

function App() {
  const [mapWidth,setMapWidth]=useState(null);
  const [smallIndex,setSmallIndex]=useState(null);
  const [snake,setSnake]=useState([{top:0,left:0} , {top:0 , left:40}]);
  const [direction,setDirection]=useState("right");
  const [foodEatenCount , setFoodEatenCount]=useState(0);
  const [foodCoordinate,setFoodCoordinate]=useState(null);

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
      <div
       style={{
        width:smallIndex,
        height:smallIndex,
        backgroundColor:"red",
        position:"absolute",
        top:foodCoordinate?.y*smallIndex,
        left:foodCoordinate?.x*smallIndex
       }}
      >
      </div>
    )
  }

  useEffect(()=>{
    setFoodCoordinate(generateFoodCoordinate(9,1))
  },[foodEatenCount]);  

  // console.log(snake)

  useInterval(()=>{
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
            return ({top:snakeEl.top , left:0-smallIndex})
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
            return ({top:0-smallIndex , left:snakeEl.left})
          }else{
            return ({top:snake[i-1].top , left:snake[i-1].left})
          }
        });

        setSnake(newSnake)
      }
    }

    if(direction=="left"){
      if(0<=snake[0].left){
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
            return ({top:snakeEl.top , left:smallIndex*smallIndex})
          }else{
            return ({top:snake[i-1].top , left:snake[i-1].left})
          }
        });

        setSnake(newSnake)
      }
    }

    if(direction=="up"){
      if(0<=snake[0].top){
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
            return ({top:smallIndex*9+smallIndex , left:snakeEl.left})
          }else{
            return ({top:snake[i-1].top , left:snake[i-1].left})
          }
        });

        setSnake(newSnake)
      }
    }

    if(snake[0]?.top==foodCoordinate?.y*smallIndex && snake[0]?.left==foodCoordinate?.x*smallIndex){
      setFoodEatenCount(prev=>prev+1);
      setSnake([...snake , {top:snake[snake.length-1].top , left:snake[snake.length-1].left}])
    }
  },500);

  useEffect(()=>{
    window.addEventListener("keydown",(e)=>{
      if(e.code=="ArrowRight" || e.code=="KeyD"){
        setDirection("right");
      }
      if(e.code=="ArrowDown" || e.code=="KeyS"){
        setDirection("down");
      }
      if(e.code=="ArrowLeft" || e.code=="KeyA"){
        setDirection("left");
      }
      if(e.code=="ArrowUp" || e.code=="KeyW"){
        setDirection("up");
      }
    })
  },[]);

  return (
    <div className="whole">
      <div ref={mapRef} className="map">
        {
          snake && snake.map((snakeEl,i)=>{
            return(
              <div style={{
                width:smallIndex ,
                height:smallIndex ,
                backgroundColor:"black" , 
                position:"absolute" ,
                top:snakeEl.top ,
                left:snakeEl.left
              }}></div>
            )
          })
        }

        {
          RenderFood()
        }
      </div>
      <div className='scoreBoard'>
        <div>Score:{foodEatenCount}</div>
      </div>
    </div>
  );
}

export default App;
