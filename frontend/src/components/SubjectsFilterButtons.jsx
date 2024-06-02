import { Button, ButtonGroup } from '@mui/material';

const SubjectsFilterButtons = ({
  setSubjectsToDisplay,
  activeSubjectFilter,
  newSubjects,
  removedSubjects,
  keptSubjects,
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
      Sujets ajoutés ({newSubjects.length} sur {numberOfSubjects})
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
      Sujets supprimés ({removedSubjects.length} sur {numberOfSubjects})
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
      Sujets gardés ({keptSubjects.length} sur {numberOfSubjects})
    </Button>,
  ];

  return (
    <ButtonGroup size='large' aria-label='Large button group'>
      {subjectFilterButtons}
    </ButtonGroup>
  );
};

export default SubjectsFilterButtons;
