import styled from 'styled-components';

export const Container = styled.div`
	background-image: url('https://www.atlassian.com/blog/wp-content/uploads/2024/01/download-78.png');
	background-position: 50%;
	background-size: cover;
	height: 100vh;
	width: 100vw;
	position: fixed;
	top: 0;
	left: 0;	
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
		margin-left: 240px; 
	}
	height: calc(100vh - 3.1rem);
	padding: 1rem;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	flex-wrap: wrap;
	align-content: flex-start;
	overflow-y: auto;
`;

export const Board = styled.div`
	color: white;
	padding: 0.6rem;
	margin: 0 0.8rem 1rem 0.8rem;
	width: 180px;
	height: 90px;
	display: flex;
    flex-direction: column; 
	border-radius: 5px;
	${(props) =>
		props.isImage ? 'background-image: url(' + props.link + ');' : 'background-color: ' + props.link + ';'}

	background-position: center center;
	background-size: cover;
	-webkit-box-shadow: rgba(0, 0, 0, 0.3) 0 1px 3px;
	-moz-box-shadow: rgba(0, 0, 0, 0.3) 0 1px 3px;
	box-shadow: rgba(0, 0, 0, 0.3) 0 1px 3px;
	opacity: 88%;
	cursor: pointer;
	will-change: opacity;
	transition: opacity 450ms;
	&:hover {
		opacity: 100%;
		transition: opacity 150ms;
		font-weight: 600;
	}
`;

export const BoardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap:8px
`;

export const AddBoard = styled(Board)`
	background-color: transparent;
	background-image: linear-gradient(rgb(109, 110, 178), rgb(91, 144, 204));
	font-size: 1rem;
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
