import fs from 'fs'
import path from 'path'
import {parseCoupon, ParsedData} from '../parser'

describe('Парсинг купонов', () => {
	const testCases = [
		{
			name: 'win match',
			inputFile: 'winMatch/input.html',
			expectedOutput: 'winMatch/output.json',
		},
		{
			name: 'win set',
			inputFile: 'winMatchSet/input.html',
			expectedOutput: 'winMatchSet/output.json',
		},
		{
			name: 'total match',
			inputFile: 'countMatch/input.html',
			expectedOutput: 'CountMatch/output.json',
		},
		{
			name: 'total set',
			inputFile: 'countSet/input.html',
			expectedOutput: 'CountSet/output.json',
		},
		{
			name: 'handicap match',
			inputFile: 'handicapMatch/input.html',
			expectedOutput: 'handicapMatch/output.json',
		},
		{
			name: 'handicap set',
			inputFile: 'handicapSet/input.html',
			expectedOutput: 'handicapSet/output.json',
		},
	]

	testCases.forEach(({name, inputFile, expectedOutput}) => {
		test(`parses ${name} correctly`, () => {
			const inputPath = path.join(__dirname, '', inputFile)
			const expectedOutputPath = path.join(__dirname, '', expectedOutput)

			const result = parseCoupon(inputPath)
			const expected: ParsedData = JSON.parse(
				fs.readFileSync(expectedOutputPath, 'utf-8'),
			)

			expect(result).toEqual(expected)
		})
	})
})
