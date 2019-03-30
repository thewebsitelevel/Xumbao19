import React from 'react';
import './Dashboard.css';
import 'tachyons';
import {Helmet} from "react-helmet";
import Xun2 from '../assets2/xun2.png';
import xunbao2 from '../assets2/xunbao2.png';
import DB from '../assets2/db.jpg';
import Play from '../assets1/play2.svg';
import FB from '../assets1/fb.svg';
import Call from '../assets1/call.svg';
import Flag from '../assets1/flag.svg';
import Slogan from '../assets1/the-online-treasure.svg';
import Share from '../assets1/share.svg';
import About from '../assets1/about.svg';
import Next from '../assets1/next.svg';




const Dashboard = () => {
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
				<div>
				   <img className=" b--white play link pointer grow dim" alt="play button" src={Play}/>
				</div>
				<div className="flex justify-between">
					<div className="bottom1 ma2  b--white">
					    <img className="ma3 link grow pointer dim" alt="sharing link" src={Share}/>
					    <img className="ma3 link grow pointer dim" alt="info link" src={About}/>
					</div>
					<div className="bottom2   ma2 b--white ">
					    <img className="pa3 link grow pointer dim" alt="next page link" src={Next}/>
					</div>
				</div>
				
			</div>
		</div>
	);
}


export default Dashboard;