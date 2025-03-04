// const Checklist = (props) => {

	
// 	const dispatch = useDispatch();
// 	const workspaceId = localStorage.getItem('workspaceId');
// 	const card = useSelector((state) => state.card);
// 	console.log(card?.members, 'propsssss')
// 	const [showAddItem, setShowAddItem] = useState(false);
// 	const [newItem, setNewItem] = useState('');
		
// 	const [suggestions, setSuggestions] = useState([]);
// 			const [mentions, setMentions] = useState([]);
		
// 		const members = card?.members || [];

// 	const { userInfo } = useSelector((state) => state.user);
// 	const userRole = userInfo?.userType;

// 	const [hideItems, setHideItems] = useState(false);


// 	const handleChecklistDelete = async (checklistId) => {
// 		await checklistDelete(workspaceId, card.cardId, card.listId, card.boardId, checklistId, dispatch);
// 	};

// 	const handleAddChecklistItem = async (checklistId) => {
// 		setShowAddItem(false);
// 		await checklistItemAdd(workspaceId, card.cardId, card.listId, card.boardId, checklistId, newItem, dispatch);
// 		setNewItem('');
// 	};

// 	const handleTextChange = (value) => {
// 		setNewItem(value);
// 		const mentionTrigger = value.match(/@(\w*)$/);
// 		if (mentionTrigger) {
// 			const keyword = mentionTrigger[1].toLowerCase();
// 			const filteredMembers = members.filter((member) =>
// 				member.name.toLowerCase().includes(keyword)
// 			);
// 			setSuggestions(filteredMembers);
// 		} else {
// 			setSuggestions([]);
// 		}
// 	};
// 	const handleMemberSelect = (member) => {
// 		setMentions([...mentions, member]);
// 		setNewItem((prev) => prev.replace(/@(\w*)$/, @${member.name} ));
// 		setSuggestions([]);
// 	};

// return (
// </>
// {userRole === 'admin' && 
// 				<RightColumn>
// 					{showAddItem ? (
// 						<TextAreaContainer>
// 							<TextArea
// 								value={newItem}
// 								onChange={(e) => handleTextChange(e.target.value)}
// 								placeholder='Add an item'
// 							/>
// 							{suggestions.length > 0 && (
// 																<MemberDropDown>
// 																	{suggestions.map((member) => (
// 																		<MemberItem key={member.id} onClick={() => handleMemberSelect(member)}>
// 																			@{member.name}
// 																		</MemberItem>
// 																	))}
// 																</MemberDropDown>
// 															)}
// 							<BottomButtonGroup
// 								title='Add'
// 								clickCallback={() => handleAddChecklistItem(props._id)}
// 								closeCallback={() => setShowAddItem(false)}
// 							/>
							
// 						</TextAreaContainer>
// 					) : (
// 						<Button clickCallback={() => setShowAddItem(true)} title='Add an item' />
// 					)}
// 				</RightColumn>
// }
// </>
// )