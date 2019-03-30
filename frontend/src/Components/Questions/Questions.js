import React from 'react';
import './Questions.css';
import 'tachyons';
import {Helmet} from "react-helmet";
import Xun2 from '../assets2/xun2.png';
import xunbao2 from '../assets2/xunbao2.png';
import DB from '../assets2/db.jpg';
import FB from '../assets1/fb.svg';
import Call from '../assets1/call.svg';
import Flag from '../assets1/flag.svg';
import Slogan from '../assets1/the-online-treasure.svg';
import Share from '../assets1/share.svg';
import About from '../assets1/about.svg';




const Questions = () => {
	return (
		<div className="backdrop ma0 ">
		    <Helmet>
                <meta charSet="utf-8" />
                <title>Xunbao 19</title>
                <link rel="canonical" href="http://mysite.com/example" />
            </Helmet>
		    <img className="backdropimage" alt="backgroound" src={DB}/>
			<div className="backdrop2 bg-black ">
			   <div className="topoption   b--white">
			      <img className="svg1 ba br-pill link grow pointer dim ma2" alt="fb link" src={FB}/>
			      <img className="svg1 link grow pointer dim ma2" alt="contact link" src={Call}/>
			      <img className="svg1 link grow pointer dim ma2" alt="leaderboard link" src={Flag}/>
			    </div>
			    <div className="logo ma2">
				   <div className=" b--white w-100  ">
				      <img className="x " alt="main " src={Xun2}/>
				      <img className="umbao" alt="main2" src={xunbao2}/>
				   </div>
			       <img className="slogan ma2" alt="slogan" src={Slogan}/>
				</div>
				<div className="quesbox bw2 shadow-5 ba">
				   <div className="w-90-ns w-90 center ma2 pa1-ns">
				      <p className="ques white"><span className="f2">&#10068;</span><br></br>
				        You know you love me, I know you care
						Just shout whenever and I'll be there
						You are my love, you are my heart
						And we will never, ever, ever be apart
						Are we an item? Girl quit playin'
						We're just friends, what are you sayin'
						Said there's another, look right in my eyes
						My first love, broke my heart for the first time
						And I was like baby, baby, baby oh
						Like baby, baby, baby no
						Like baby, baby, baby oh
						
                    </p>
                    <input className="answer ma2 f4 w-70-ns w-90 ba b-white br-pill pa2" type="text" name="Answer" placeholder="Write your answer here..."/>
				   </div>
				</div>
				<p className="submit white w-20-ns w-80 f3 cursive center ba b--white pa2 dim link pointer grow br-pill">
					SUBMIT
				</p>
				<div className="flex justify-between">
					<div className="bottom1 ma2  b--white">
					    <img className="ma3 link grow pointer dim" alt="sharing link" src={Share}/>
					    <img className="ma3 link grow pointer dim" alt="info link" src={About}/>
					</div>
				</div>
				
			</div>
		</div>
	);
}


export default Questions;