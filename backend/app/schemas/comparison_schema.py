from typing import List, Dict, Set

class ListMaterials(List[str]):
    """
    A custom list class for materials that inherits from List[str].
    """

    def __init__(self, *args):
        super().__init__(*args)

    def __eq__(self, other):
        if not isinstance(other, ListMaterials):
            return False
        return sorted(self) == sorted(other)

    def __hash__(self):
        return hash(tuple(sorted(self)))

    def compare_with(self, other: 'ListMaterials') -> 'ComparaisonMaterialsResult':
        added_materials = ListMaterials(
            [item for item in self if item not in other])
        removed_materials = ListMaterials(
            [item for item in other if item not in self])
        kept_materials = ListMaterials(
            [item for item in self if item in other])
        return ComparaisonMaterialsResult(added_materials,removed_materials,kept_materials)


class Subject:
    """
    A model for a subject in a report.
    """
    def __init__(self, domaine: str, niveau: str, intitule: str):
        self.domaine = domaine
        self.niveau = niveau
        self.intitule = intitule

    def __eq__(self, other):
        if isinstance(other, Subject):
            return (self.domaine == other.domaine and self.niveau == other.niveau and self.intitule == other.intitule)
        return False

    def __hash__(self):
        return hash((self.domaine, self.niveau, self.intitule))
    
    def __str__(self):
        return self.domaine + " " + self.niveau + " " + self.intitule


class SubjectsWithMaterials(Dict[Subject, List[ListMaterials]]):
    """
    A model that associates a subject with all different configurations of materials.
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def compare_with(self, other: 'SubjectsWithMaterials') -> 'ComparisonSubjectsResult':
        added_subjects = SubjectsWithMaterials()
        removed_subjects = SubjectsWithMaterials()
        kept_subjects = SubjectsWithMaterials()
        identical_subjects = SubjectsWithMaterials()

        self_keys: Set[Subject] = set(self.keys())
        other_keys: Set[Subject] = set(other.keys())

        # keys in the instance A, but not in the instance B
        added_keys = self_keys - other_keys
        # keys in the instance B, but not in the instance A
        removed_keys = other_keys - self_keys
        kept_keys = self_keys & other_keys  # keys in the instance A AND in the instance B

        for key in added_keys:
            added_subjects[key] = self[key]

        for key in removed_keys:
            removed_subjects[key] = other[key]

        for key in kept_keys:

            # Convertir les sous-listes en tuples pour pouvoir les utiliser dans des ensembles
            self_allListMaterials = set(tuple(sublist)
                                        for sublist in self_keys)
            other_allListMaterials = set(tuple(sublist)
                                         for sublist in other_keys)

            # Trouver les listes identiques entre A et B
            identiques = self_allListMaterials & other_allListMaterials
            # Trouver les listes sans équivalent (présentes dans A mais pas dans B et vice versa)
            differentes = (self_allListMaterials - other_allListMaterials) | (
                other_allListMaterials - self_allListMaterials)

            # Convertir les tuples en listes pour le résultat final
            identiques_list = [list(item) for item in identiques]
            differentes_list = [list(item) for item in differentes]

            if (identiques_list.count > 0):
                identical_subjects[key] = identiques_list
            if (differentes_list.count > 0):
                kept_subjects[key] = differentes_list

        return ComparisonSubjectsResult(added_subjects, removed_subjects, kept_subjects, identical_subjects)

    def count(self) -> int:
        total_count = 0
        for materials_list in self.values():
            for materials in materials_list:
                total_count += len(materials)
        return total_count
    
    def __str__(self):
        chaine = ""
        for key in self: 
            chaine += "Subject : " + key.__str__() + '\n'
            values = self[key]
            for listMaterials in values:
                chaine += "Materials : "
                for material in listMaterials:
                    chaine += material + ", "
                chaine += '\n'
        return chaine



class ComparisonSubjectsResult:
    """
    A model for the result of a comparison.
    """

    def __init__(self, added_subjects: SubjectsWithMaterials, removed_subjects: SubjectsWithMaterials, kept_subjects: SubjectsWithMaterials, identical_subjects: SubjectsWithMaterials):
        self.added_subjects = added_subjects
        self.removed_subjects = removed_subjects
        self.kept_subjects = kept_subjects
        self.identical_subjects = identical_subjects


class ComparaisonMaterialsResult:
    
    def __init__(self, added_materials: ListMaterials, removed_materials: ListMaterials, kept_materials: ListMaterials):
        self.added_materials = added_materials
        self.removed_materials = removed_materials
        self.kept_materials = kept_materials

    def __str__(self):
        chaine = "Matériel ajouté (" + self.added_materials.count + ") : \n"
        for m in self.added_materials:
            chaine += "• " + m + '\n'
        chaine += "Matériel supprimé (" + \
            self.removed_materials.count + ") : \n"
        for m in self.removed_materials:
            chaine += "• " + m + '\n'
        chaine += "Matériel gardé (" + self.kept_materials.count + ") : \n"
        for m in self.kept_materials:
            chaine += "• " + m + '\n'
        return chaine
