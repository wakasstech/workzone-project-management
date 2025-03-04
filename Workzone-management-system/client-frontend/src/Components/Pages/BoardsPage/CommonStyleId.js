import styled from 'styled-components';

export const TextSpan = styled.span`
	font-size: 0.85rem;
	font-weight: 600;
`;

export const Button = styled.button`
	display: flex;
	align-items: center;
	background-color: rgba(255, 255, 255, 0.25);
	border: none;
	color: white;
	height: 2rem;
	gap: 0.3rem;
	padding: 0rem 0.7rem;
	border-radius: 3px;
	cursor: pointer;
	transition: 250ms ease;
	&:hover {
		background-color: rgba(255, 255, 255, 0.5);
	}
`;

export const ClickableIcon = styled.div`
	color: ${(props) => props.color};
	background:linear-gradient(70deg, #3a74ff, #229ba0, #cf9324);
	width: 1.5rem;
	height: 1.5rem;
	cursor: pointer;
    // box-shadow: rgb(143 170 180) 2px 2px 4px 2px;
	transition: 150ms ease-in;
	border-radius: 10px;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	&:hover {
		background: linear-gradient(70deg, #3a74ff, #229ba0, #cf9324);
	}
`;
