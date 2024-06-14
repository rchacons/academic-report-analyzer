import { removeStopwords, fra } from 'stopword'

export const tokenize = (query) => {
  return removeStopwords(query.toLowerCase().split(' '), fra)
}
