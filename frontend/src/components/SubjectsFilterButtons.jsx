import { Button, ButtonGroup } from '@mui/material'

const SubjectsFilterButtons = ({
  itemsType,
  setitemsToDisplay,
  activeItemtFilter,
  addedItems,
  removedItems,
  keptItems,
  allItems,
  keys,
  numberOfItems,
}) => {
  const subjectFilterButtons = [
    <Button
      key={keys[0]}
      thin
      variant={activeItemtFilter === keys[0] ? 'contained' : 'outlined'}
      onClick={() => setitemsToDisplay(keys[0])}
    >
      {itemsType} ajoutés ({addedItems.length} sur {numberOfItems})
    </Button>,

    <Button
      key={keys[1]}
      thin
      variant={activeItemtFilter === keys[1] ? 'contained' : 'outlined'}
      onClick={() => setitemsToDisplay(keys[1])}
      sx={{
        '&:focus': {
          outline: 'none',
        },
        '&:active': {
          border: 'none',
        },
      }}
    >
      {itemsType} supprimés ({removedItems.length} sur {numberOfItems})
    </Button>,
    <Button
      key={keys[2]}
      thin
      variant={activeItemtFilter === keys[2] ? 'contained' : 'outlined'}
      onClick={() => setitemsToDisplay(keys[2])}
      sx={{
        '&:focus': {
          outline: 'none',
        },
        '&:active': {
          border: 'none',
        },
      }}
    >
      {itemsType} gardés ({keptItems.length} sur {numberOfItems})
    </Button>,
    <Button
      key={keys[3]}
      thin
      variant={activeItemtFilter === keys[3] ? 'contained' : 'outlined'}
      onClick={() => setitemsToDisplay(keys[3])}
      sx={{
        '&:focus': {
          outline: 'none',
        },
        '&:active': {
          border: 'none',
        },
      }}
    >
      Tous les {itemsType} ({allItems.length} sur {numberOfItems})
    </Button>,
  ];

  return (
    <ButtonGroup size="large" aria-label={`${itemsType} filter tabs`}>
      {subjectFilterButtons}
    </ButtonGroup>
  )
}

export default SubjectsFilterButtons
