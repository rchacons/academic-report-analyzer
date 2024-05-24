import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

const materielData = [
  'plant de fraisier',
  'iris',
  'plant de pomme de terre',
  'pomme de terre germée matériel pour culture in vitro : œil de pomme de terre',
  'eau de javel diluée ou domestos dilué au cinquième',
  'eau distillée stérile',
  'milieu de culture : agar (8 g, l)',
  'solution mère de knop',
  'oligoéléments : pour 1 litre de solution mère (znso4 : 1 mg, h3bo3 : 1 mg, mnso4 : 0, 1 mg, cuso4 : 0, 03 mg, kcl : 0, 01 mg)',
  'saccharose : 20 g',
  '1 de solution mère',
  'matériel biologique stérile (scalpel et pinces enfermés dans du papier aluminium, boîte de pétri)',
  "fiche technique : réalisation d'une culture in vitro lames + lamelles + microscope + eau iodée",
];

const EquipmentList = () => {
  return (
    <Box
      sx={{
        maxHeight: 700,
        overflow: 'auto',
        margin: '0 auto',
        padding: 2,
        border: '1px solid lightGray',
      }}
    >
      <Typography variant='h6' component='div' gutterBottom>
        Matériel imposé
      </Typography>
      <Typography variant='body1' component='div' gutterBottom>
        Total : {materielData.length}
      </Typography>
      <Divider />

      <List dense disablePadding>
        {materielData.map((item, index) => (
          <ListItem key={index}>
            <ListItemIcon>
              <FiberManualRecordIcon
                htmlColor='#1C2833'
                sx={{ fontSize: '12px' }}
              />
            </ListItemIcon>
            <ListItemText primary={item} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default EquipmentList;
