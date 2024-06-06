import { Button, ButtonGroup } from '@mui/material';

const SubjectsFilterButtons = ({
  itemsType,
  setSubjectsToDisplay,
  activeSubjectFilter,
  newSubjects,
  removedSubjects,
  keptSubjects,
  allSubjects,
  numberOfSubjects,
}) => {
  const subjectFilterButtons = [
    <Button
      key='new_subjects'
      thin
      variant={
        activeSubjectFilter === 'new_subjects' ? 'contained' : 'outlined'
      }
      onClick={() => setSubjectsToDisplay('new_subjects')}
    >
      {itemsType} ajoutés ({newSubjects.length} sur {numberOfSubjects})
    </Button>,

    <Button
      key='removed_subjects'
      thin
      variant={
        activeSubjectFilter === 'removed_subjects' ? 'contained' : 'outlined'
      }
      onClick={() => setSubjectsToDisplay('removed_subjects')}
      sx={{
        '&:focus': {
          outline: 'none',
        },
        '&:active': {
          border: 'none',
        },
      }}
    >
      {itemsType} supprimés ({removedSubjects.length} sur {numberOfSubjects})
    </Button>,
    <Button
      key='kept_subjects'
      thin
      variant={
        activeSubjectFilter === 'kept_subjects' ? 'contained' : 'outlined'
      }
      onClick={() => setSubjectsToDisplay('kept_subjects')}
      sx={{
        '&:focus': {
          outline: 'none',
        },
        '&:active': {
          border: 'none',
        },
      }}
    >
      {itemsType} gardés ({keptSubjects.length} sur {numberOfSubjects})
    </Button>,
     <Button
     key='all_subjects'
     thin
     variant={
       activeSubjectFilter === 'all_subjects' ? 'contained' : 'outlined'
     }
     onClick={() => setSubjectsToDisplay('all_subjects')}
     sx={{
       '&:focus': {
         outline: 'none',
       },
       '&:active': {
         border: 'none',
       },
     }}
   >
     Tous les {itemsType} ({allSubjects.length} sur {numberOfSubjects})
   </Button>,
  ];

  return (
    <ButtonGroup size='large' aria-label={`${itemsType} filter tabs`}>
      {subjectFilterButtons}
    </ButtonGroup>
  );
};

export default SubjectsFilterButtons;
