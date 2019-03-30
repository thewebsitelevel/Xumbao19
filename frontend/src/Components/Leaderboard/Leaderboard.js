import React from 'react';
import './Leaderboard.css';
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
import Face from '../assets2/j.jpeg';




const Leaders = function Leader(){
	for(let i=1;i<10;i++){
		return(
			<div className="leader  b--white ">
				       <div className="name">
						     <p className="white f2-ns f5">{`${i}`}
						     </p>
					         <img className="face" src={`${Face}`}/>
						     <div className="namemail ">
							     <p className="white f3-ns f5 leadername  b--white"> {`${"Ravinder"}`}
							     </p>
							     <p className="white f5-ns f7 b--white"> {`${"itskumarravinder@gmail.com"}`}
							     </p>
							 </div>
				       </div>
						 <div className="score white">
						   <p className="f2-ns f5">
						     Score:{`${"43"}`}
						   </p>
						 </div>
				   </div>

			)
	}
}

const Leaderboard = () => {
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
			      <img className="svg1  br-pill link grow pointer dim ma2" alt="fb link" src={FB}/>
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
				<div className="leaderboard  b--white">
				   <div className="leaderheader  b--white">
				      <p className=" f1-ns f4 roboto pa3 white">
				        Leaderboard
				      </p>
				      <p className="white f3-ns f4 total">
				         <span className="f1-ns f3 ">&#8721;</span>
				         Total Submissions<br></br> {`${"576"}`}
				      </p>
				   </div>
				   {Leaders()}
				   {Leaders()}
				   {Leaders()}
				   {Leaders()}
				   {Leaders()}
				   {Leaders()}
				   {Leaders()}
				   

				   <div className="leader  b--white ">
				   </div>
				   <div className="leader  b--white ">
				   </div>
				</div>
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


export default Leaderboard;