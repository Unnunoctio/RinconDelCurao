export const sameStrings = (array1, array2) => {
  if (array1?.length !== array2?.length) {
    return false
  }

  array1.sort()
  array2.sort()

  return array1.every((element, index) => element === array2[index])
}
