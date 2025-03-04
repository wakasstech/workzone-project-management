import styled from 'styled-components';

export const Board = styled.div`
	color: white;
	padding: 0.6rem;
	margin: 0 0.8rem 1rem 0.8rem;
	width: 200px;
	height: 120px;
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