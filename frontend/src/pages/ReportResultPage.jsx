import { useEffect, useState } from 'preact/hooks'
import { useLocation } from 'react-router-dom'
import { Autocomplete, Box, Button, Grid, TextField, Tooltip } from '@mui/material'
import MultipleSelectChip from '../components/shared/MultipleSelectChip'
import ReportsTable from '../components/ReportsTable'
import SearchBar from '../components/SearchBar'
import SubjectsFilterButtons from '../components/SubjectsFilterButtons'
import { tokenize } from '../utils'
import { exportData } from '../services/ExportService'
import SimpleSelect from '../components/shared/SimpleSelect'

export const ReportResultPage = () => {
  const location = useLocation()

  const { comparisonResult } = location.state || {}
  const addedSubjects = comparisonResult.added_subjects.map((item, index) => ({
    id: `ns${index}`,
    ...item,
  }))
  const removedSubjects = comparisonResult.removed_subjects.map((item, index) => ({
    id: `rs${index}`,
    ...item,
  }))
  const keptSubjects = comparisonResult.kept_subjects.map((item, index) => ({
    id: `ks${index}`,
    ...item,
  }))
  const allSubjects = addedSubjects.concat(removedSubjects).concat(keptSubjects)

  const levels = comparisonResult.level_list
  const fields = comparisonResult.field_list
  const themes = comparisonResult.theme_list

  const [activeSubjectFilter, setActiveSubjectFilter] = useState('added_subjects')
  const [displayedSubjects, setDisplayedSubjects] = useState([])
  const [selectedSubjects, setSelecetedSubjects] = useState([])

  const [filterLevels, setFilterLevels] = useState([])
  const [filterFields, setFilterFields] = useState([])
  const [filterDoc, setFilterDoc] = useState(0)
  const [filterTheme, setFilterTheme] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const applyFilters = (subjects, levelsFilter, fieldsFilter, docFilter, themeFilter) => {
    return subjects.filter((subject) => {
      return (
        (levelsFilter.length === 0 || levelsFilter.includes(subject.level.toLowerCase())) &&
        (fieldsFilter.length === 0 || fieldsFilter.includes(subject.field.toLowerCase())) &&
        (docFilter === 0 || getOrigin(subject).includes(docFilter)) &&
        (themeFilter === null || themeFilter === '' || subject.theme === themeFilter)
      )
    })
  }

  const getOrigin = (subject) => {
    const origins = subject.materials_configurations.map((config) => config.origin)
    return [...new Set(origins)].join(' ')
  }

  const search = (query, items) => {
    if (!query) return items
    const tokens = tokenize(query.toLowerCase())
    console.log('tokenized query:', tokens)

    return items
      .map((item) => {
        // Calcul du score pour l'intitulé' de l'item
        let itemScore = 0
        tokens.forEach((token) => {
          if (item.title_research.toLowerCase().includes(token)) {
            itemScore += 1
          }
        })

        // Calcul des scores pour chaque liste de matériel
        const materialsScores = item.materials_configurations.map((config) => {
          let configScore = 0
          tokens.forEach((token) => {
            config.materials.forEach((material) => {
              if (material.toLowerCase().includes(token)) {
                configScore += 1
              }
            })
          })
          return { ...config, score: configScore }
        })

        // Tri listes de matériel par score décroissant
        materialsScores.sort((a, b) => b.score - a.score)

        // Score maximum parmi les listes de matériel
        const maxMaterialScore = Math.max(...materialsScores.map((config) => config.score))

        // Score global de l'item
        const totalScore = itemScore + maxMaterialScore

        return {
          ...item,
          score: totalScore,
          materials_configurations: materialsScores,
        }
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
  }

  const getSubjectsByType = (subjectFilter) => {
    let subjects
    switch (subjectFilter) {
      case 'added_subjects':
        subjects = addedSubjects
        break
      case 'removed_subjects':
        subjects = removedSubjects
        break
      case 'kept_subjects':
        subjects = keptSubjects
        break
      case 'all_subjects':
        subjects = allSubjects
        break
      default:
        subjects = []
    }
    return subjects
  }

  const setSubjectsToDisplay = (subjectFilter) => {
    let subjects = getSubjectsByType(subjectFilter)
    subjects = applyFilters(subjects, filterLevels, filterFields, filterDoc, filterTheme)
    subjects = search(searchQuery, subjects)
    setActiveSubjectFilter(subjectFilter)
    setDisplayedSubjects(subjects)
  }

  const handleFilterLevelsChange = (event) => {
    const selectedLevels = event.target.value
    setFilterLevels(selectedLevels)
    setSubjectsToDisplay(activeSubjectFilter)
  }

  const handleFilterFieldsChange = (event) => {
    const selectedFields = event.target.value
    setFilterFields(selectedFields)
    setSubjectsToDisplay(activeSubjectFilter)
  }

  const handleFilterDocChange = (event) => {
    const selectedDoc = event.target.value
    setFilterDoc(selectedDoc)
    setSubjectsToDisplay(activeSubjectFilter)
  }

  const handleFilterThemeChange = (event, value) => {
    setFilterTheme(value || '')
    setSubjectsToDisplay(activeSubjectFilter)
  }

  const handleSearchResults = (query) => {
    setSearchQuery(query)
    setSubjectsToDisplay(activeSubjectFilter)
  }

  const handleExportSubjects = async () => {
    const subjectsToExport = allSubjects
      .filter((subject) => selectedSubjects.includes(subject.id))
      .map(({ id, ...rest }) => rest) // Exclure 'id' des élémentss
    await exportData(subjectsToExport, 'liste_sujets')
  }

  useEffect(() => {
    setSubjectsToDisplay(activeSubjectFilter)
  }, [filterLevels, filterFields, filterDoc, filterTheme, searchQuery])

  return (
    <Grid container spacing={2} justifyContent="space-between" p="1em 2em">
      <Grid item xs={12} md={10}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'left',
            '& > *': {
              m: 1,
            },
          }}
        >
          <SubjectsFilterButtons
            itemsType={'Sujets'}
            setitemsToDisplay={setSubjectsToDisplay}
            activeItemtFilter={activeSubjectFilter}
            addedItems={addedSubjects}
            removedItems={removedSubjects}
            keptItems={keptSubjects}
            allItems={allSubjects}
            keys={['added_subjects', 'removed_subjects', 'kept_subjects', 'all_subjects']}
            numberOfItems={allSubjects.length}
          />
        </Box>
      </Grid>

      <Grid item xs={12} md={2}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'right',
          }}
        >
          <Tooltip title="Exporter les éléments sélectionnés au format xlsx">
            <Button variant="outlined" thin color="primary" onClick={handleExportSubjects}>
              Exporter
            </Button>
          </Tooltip>
        </Box>
      </Grid>

      <Grid item xs={12} md={12}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            '& > *': {
              m: 0.5,
            },
          }}
        >
          <MultipleSelectChip
            name="Domaines"
            items={fields}
            selectedValue={filterFields}
            onChange={handleFilterFieldsChange}
          ></MultipleSelectChip>

          <MultipleSelectChip
            name="Niveaux"
            items={levels}
            selectedValue={filterLevels}
            onChange={handleFilterLevelsChange}
          ></MultipleSelectChip>

          <SimpleSelect
            name="Document"
            items={[1, 2]}
            selectedValue={filterDoc}
            onChange={handleFilterDocChange}
          />

          <Autocomplete
            disablePortal
            disabled={themes.length == 0}
            id="theme-filter"
            options={themes}
            size="small"
            sx={{ width: 300 }}
            value={filterTheme}
            onChange={handleFilterThemeChange}
            renderInput={(params) => <TextField {...params} label="Thèmes" />}
          />
          <SearchBar onSearch={handleSearchResults}></SearchBar>
        </Box>
      </Grid>

      <Grid item xs={12} md={12}>
        <ReportsTable reports={displayedSubjects} setSelectedSubjects={setSelecetedSubjects} />
      </Grid>
    </Grid>
  )
}
