import React, { useEffect, useState } from 'react';
import * as style from './styleId';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import * as common from '../CommonStyleId';

import { useDispatch, useSelector } from 'react-redux';
import RightDrawer from '../../../Drawers/RightDrawer/RightDrawer';
import BasePopover from '../../../Modals/EditCardModal/ReUsableComponents/BasePopover';
import InviteMembersBoards from '../../../Modals/EditCardModal/Popovers/InviteMembersBoards/InviteMembersBoards';



const TopBarBoards = ({spaceName, role}) => {
	const workspaceId = localStorage.getItem('workspaceId');
	const board = useSelector((state) => state.board);
	const [currentTitle, setCurrentTitle] = useState(board.title);
	// console.log(currentTitle, 'current Title');
	const [invitePopover, setInvitePopover] = React.useState(null);
	const dispatch = useDispatch();
	useEffect(()=>{
		if(!board.loading)
			setCurrentTitle(board.title);
	},[board.loading, board.title]);
	const handleTitleChange = () => {
		// boardTitleUpdate(workspaceId,currentTitle,board.id,dispatch);
        console.log('eheh')
	};
	return (
		<style.TopBar>
			<style.LeftWrapper>
				{role === 'admin' && 
				<style.InviteButton onClick={(event) => setInvitePopover(event.currentTarget)}>
					<PersonAddAltIcon />
					<style.TextSpanWorkspace>Add Member Workspace</style.TextSpanWorkspace>
				</style.InviteButton>
				}
				{invitePopover && (
				<BasePopover
					anchorElement={invitePopover}
					closeCallback={() => {
						setInvitePopover(null);
					}}
					title='Invite Members'
					contents={<InviteMembersBoards closeCallback={() => {
						setInvitePopover(null);
					}}/>
				
				}
				/>
			)}
            
				<style.BoardNameInput
					placeholder='Board Name'
					value={spaceName}
                   
				/>


			</style.LeftWrapper>
        
			
		</style.TopBar>
	);
};

export default TopBarBoards;
