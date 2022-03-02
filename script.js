/**
 * 
 * This script lets me easily add changelog touchpoint information to all of my notes in NotePlan 
 * 
 * @author Josh Long 
 * 
 */
async function changelogNote(){
	const cb = CommandBar 
	function log(s){
		console.log(s )
	}
	const changelog = 'Changelog'
	const changelogHeader = '## ' + changelog 
	
	// the idea is that you use this plugin to:  
	// - rename the file to have the current date by changing the first paragraph (the '#' title)
	// - maintain a section in the note called changelog which has bullets with the date and time appended
 	
 	function pad (n){
		return n < 10 ? '0' + n : n + '' ;
	}

	function currentDatetimeString (currentDate) {
			return currentDate.getHours () +':' + currentDate.getMinutes() + ':'+ currentDate.getSeconds(); 
	}

	function currentDateString (currentDate){
		const cDay = currentDate.getDate()
		const cMonth = currentDate.getMonth() + 1
		const cYear = currentDate.getFullYear()
		const s = cYear  +'-' + pad(cMonth) + '-'+  pad(cDay)
		return s 
	}

	async function ensureChangelogExists (note) {
			const d = new Date();
			function appendChangelog (){
				let c = ''
				c += '\n\n' 
				c += changelogSectionHeader
				c += '\n\n'
				c += ' - ' + currentDateString()
				c += '\n'
				return c 
			}
			const paras = note.paragraphs
			const ds = currentDateString(d) 
			const dts = currentDatetimeString(d);
			const ts = ds + ' ' + dts 
  			const text = await cb.showInput("What's happened?", ts)
  			
  			// make sure there's a title that has the date. we need a title otherwise the next bit won't work
  			const paragraphs  = Editor.paragraphs
  			if (paragraphs.length > 0 ){
			  const p = paragraphs [0]
			  if (p.type === 'title') {
			  	const divider = ' | '
			  	const txt = p.content 
			  	if ( txt .indexOf(divider)!=-1) {
			  	 const keep = txt.split(divider)[1]
			  	 p.content = ds + divider + keep.trim()
			  	}
			  	else {
			  		p.content = ds + divider + txt  
			  	}
			  	paragraphs [0] = p 
			  	Editor.paragraphs = paragraphs
			  }
  			}

  			// update the changelog 
			Editor.addParagraphBelowHeadingTitle(ts + ' - ' + text, 'list', changelog, true, true)

	}

	if(Editor.type ==  'Notes') {
	 ensureChangelogExists(Editor.note)	
	}

}