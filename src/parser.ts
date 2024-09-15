import * as cheerio from 'cheerio'

import fs from 'fs'

interface Outcome {
	type?: string
	player?: number
	period?: string
	set?: string
	over?: boolean
	count?: number
	handicap?: number
	rate?: number
	team1?: string
	team2?: string
	coefficient?: string
}
const filePath = './src/tests/winMatchSet/input.html'
const jsonData = parseCoupon(filePath)

export function parseCoupon(filePath: string): Outcome {
	const outcomeRes: Outcome = {
		type: '',
		period: '',
		player: 0,
	}

	const html = fs.readFileSync(filePath, 'utf-8')

	const $ = cheerio.load(html)

	const eventDetails = $('.group--hAXBT._event-name--jqpbC')
		.text()
		.replace(/\d+(\.\d+)?/g, '')
		.replace('-й сет', '')
		.replace('(+)', '')
		.replace('(-)', '')
		.replace(':', '')
		.replace(' ', '')
		.replace(/\n/g, '')
		.replace(/\t/g, '')
		.replace(/\r/g, '')
		.replace(/\s+/g, ' ')
		.trim()

	const teams = eventDetails.split('–').map((team) => team.trim())
	const team1 = teams[0]
	const team2 = teams[1]

	const outcome = $('.group--hAXBT:contains("Исход:")')
		.text()
		.trim()
		.replace('Исход:', '')
		.trim()

	const coefficient = $('.group--hAXBT:contains("Коэффициент:")')
		.text()
		.trim()
		.replace('Коэффициент:', '')

	const set = $('.group--hAXBT:not(.title--dyGko)').text().match(/\d+/)?.[0]

	const count = $('.group--hAXBT:not(.title--dyGko)')
		.text()
		.replace(/[^\>\<]+/g, '')
		.trim()

	const param = $('.parameter--h05r6').text().trim()

	const notParseDetails = $('.group--hAXBT._event-name--jqpbC').text().trim()

	param == '' || undefined || null ? false : true

	const player = $('.group--hAXBT:contains("Исход:")')
		.text()
		.trim()
		.replace('Исход:', '')
		.replace(' ', '')
		.replace('Поб', '')

	const handicap = $('.parameter--h05r6')
		.text()
		.replace('+', '')
		.replace('-', '')
		.trim()

	if (
		outcome.includes('Поб 1') ||
		(outcome.includes('Поб 2') && notParseDetails.length === 0)
	) {
		outcomeRes.type = 'win'
		outcomeRes.period = 'match'
		outcomeRes.player = Number(player)
	} else if (
		outcome.includes('сет') ||
		(notParseDetails.includes('сет') && !param)
	) {
		outcomeRes.type = 'win'
		outcomeRes.player = Number(player)
		outcomeRes.period = 'set'
		outcomeRes.set = set
	} else if (
		(outcome.includes('1') && !notParseDetails.includes('сет') && !count) ||
		(outcome.includes('2') && !notParseDetails.includes('сет') && !count)
	) {
		outcomeRes.type = 'handicap'
		outcomeRes.period = 'match'
		outcomeRes.player = Number(player)
		outcomeRes.count = Number(handicap)
	} else if (
		outcome.includes('сет') ||
		(notParseDetails.includes('сет') && !count)
	) {
		outcomeRes.type = 'handicap'
		outcomeRes.period = 'set'
		outcomeRes.player = Number(player)
		outcomeRes.count = Number(handicap)
		outcomeRes.set = set
	} else if (count && !notParseDetails.includes('сет')) {
		outcomeRes.type = 'total'
		outcomeRes.period = 'match'
		outcomeRes.player = Number(player) ? Number(player) : 0
		outcomeRes.count = Number(param)
		count === '>' ? (outcomeRes.over = true) : (outcomeRes.over = false)
	} else if (
		(count && outcome.includes('сет')) ||
		notParseDetails.includes('сет')
	) {
		outcomeRes.type = 'total'
		outcomeRes.period = 'set'
		outcomeRes.player = Number(player) ? Number(player) : 0
		outcomeRes.count = Number(param)
		outcomeRes.set = set
		count === '>' ? (outcomeRes.over = true) : (outcomeRes.over = false)
	}

	const result = {
		team1,
		team2,
		outcome: outcomeRes,
		rate: Number(coefficient),
	}

	return result
}
console.log(JSON.stringify(jsonData, null, 2))
