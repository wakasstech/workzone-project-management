import React from 'react';
import { Container, ButtonContainer } from './styled';
import MenuButton from './MenuButton';
import { Hr } from '../../styled';
import BoardIcon from '@mui/icons-material/Dashboard';
import BackgroundIcon from '@mui/icons-material/Wallpaper';
import ActivitySection from './ActivitySection/ActivitySection';
import { useSelector } from 'react-redux';
const MainMenu = (props) => {

	const user = useSelector((state) => state.user.userInfo);

	return (
		<Container>
			<ButtonContainer>
				<MenuButton
					icon={<BoardIcon fontSize='small' color='inherit'/>}
					title='About this board'
					description='Add a description to your board'
					clickCallback={()=>props.menuCallback('About this board')}
				/>
					{user?.userType === 'admin'  && (
				<MenuButton
					icon={<BackgroundIcon fontSize='small' color='inherit'/>}
					title='Change background'
					description='Change the background of your board'
					clickCallback={()=>props.menuCallback('Change background')}
				/>
					)}
			</ButtonContainer>
			<Hr />
			{/* <ActivitySection /> */}
		</Container>
	);
};

export default MainMenu;
