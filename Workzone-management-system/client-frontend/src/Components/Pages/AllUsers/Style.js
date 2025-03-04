import styled from 'styled-components';

export const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  background-image: url('https://img.freepik.com/free-photo/abstract-wavy-shapes_1048-4740.jpg?t=st=1694683687~exp=1694684287~hmac=79a794d031178179a7ff12b1417d7933a6fca2ca6cc5612f30f9d56b78444367');
  background-position: 50%;
  background-size: cover;

  ::before {
    // content: '';
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgb(168 185 192 / 50%); /* Adjust the opacity here */
  }
`;


export const Title = styled.h1`
  cursor: default;
  font-weight: bold;
  font-size: 2rem;
  text-align: center;
  width: 100vw;
  margin-bottom: 2rem;
  color: #fff; /* Set the text color to white */
  text-shadow: 2px 3px 4px rgb(4, 4, 19); /* Add a text shadow */
  user-select: none;
`;


export const Wrapper = styled.div`
	margin-top: 3.1rem;
	
	width: 100%; /* Set default width to 100% */

	@media (min-width: 768px) {
		/* Media query for desktop view */
		width: calc(100% - 240px); 
		margin-left: 250px; 
	}
	
	height: calc(100vh - 3.1rem);
	// padding: 1rem 0rem;
	// display: flex;
	// flex-direction: row;
	// // justify-content: center;
	// // align-items: center;
	// flex-wrap: wrap;
	align-content: flex-start;

`;

export const Board = styled.div`
	color: white;
	padding: 0.6rem;
	margin: 0 0.8rem 1rem 0.8rem;
	width: 180px;
	height: 90px;
	border-radius: 5px;
	background-image: url('https://images.unsplash.com/photo-1694900565922-d279cef76fd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MDY2fDB8MXxjb2xsZWN0aW9ufDR8MzE3MDk5fHx8fHwyfHwxNjk1MjA0OTQ2fA&ixlib=rb-4.0.3&q=80&w=400&quot');
	// background-image: url('https://img.freepik.com/free-photo/abstract-dark-background-with-flowing-colouful-waves_1048-13124.jpg?t=st=1694683437~exp=1694684037~hmac=d6506c5c564398a3842c559bde859f943cedddb77a5c04039f45e8df74ccc1a4');
	/* Apply text transformation to capitalize first letter */
	::first-letter {
		text-transform: capitalize;
	};
	${(props) =>
    props.isImage ? 'background-image: url(' + props.link + ');' : 'background-color: ' + props.link + ';'}

	background-position: center center;
	background-size: cover;
	-webkit-box-shadow: rgba(0, 0, 0, 0.3) 0 1px 3px;
	-moz-box-shadow: rgba(0, 0, 0, 0.3) 0 1px 3px;
	box-shadow: rgba(0, 0, 0, 0.3) 0 1px 3px;
	opacity: 80%;
	cursor: pointer;
	will-change: opacity;
	transition: opacity 450ms;
	font-weight: 600;
	&:hover {
		opacity: 100%;
		transition: opacity 150ms;
		font-weight: 600;
	}
`;

export const AddWorkspace = styled(Board)`
	background-color: transparent;
	background-image: linear-gradient(to right, #0b486b 0%, #f56217 51%, #0b486b 100%);
	font-size: 1.2rem;
	transition: 2s;
	opacity: 65%;
	background-size: 200% auto;
	color: white;
	display: flex;
	align-items: center;
	justify-content: center;
	text-decoration: none;
	font-weight: 600;
	&:hover {
		background-position: right center;
		color: #fff;
		transition: 400ms ease-in;
	}
`;
