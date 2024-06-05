// nodes
const wrap = document.querySelector(".wrap")
const mainTitle = document.querySelector(".main-title")


class SermonsApp {
  
  // Control variables
  constructor(data) {
    // Page status
    this.currentPage = 0 // 0: categories, 1: sermons, 2: sermon
    this.currentCategory = ""
    this.currentSermon = {}
    this.data = data
  }

  // Update page h1
  updateMainTitle() {
    if (this.currentPage === 0) {
      mainTitle.innerHTML = "Temas"
    } else if (this.currentPage === 1) {
      mainTitle.innerHTML = "Sermones"
    } else if (this.currentPage === 2) {
      mainTitle.innerHTML = this.currentSermon.title
    }
  }

  // Clean main content wrapper
  cleanWrap() {
    wrap.innerHTML = ""
  }

  // Render categories cards with main data
  renderCategories() {
    
    // Get categories calculated data
    for (const category in this.data) {

      // Get sermons data
      const categorySermons = this.data[category]
      let sermonsAuthors = categorySermons.map(sermon => sermon.author)
      sermonsAuthors = [...new Set(sermonsAuthors)]
      let dates = categorySermons.map(sermon => sermon.date)
      let years = dates.map(date => date.split("/")[2])
      const maxYear = Math.max(...years)
      const minYear = Math.min(...years)
      if (minYear === maxYear) {
        years = minYear
      } else {
        years = `${minYear} - ${maxYear}`
      }

      // Render category
      wrap.innerHTML += `
      <article class="card category" onClick="app.onClickCategory('${category}')">
        <h2>${category}</h2>
        <p class="subtitle year">
          ${years}
        </p>
        <p>
          <strong>Autores</strong> ${sermonsAuthors.join(", ")}
        </p>
        <p>
          <strong>Sermones</strong> ${categorySermons.length}
        </p>
      </article>
      `
    }

  }

  // render sermons cards
  renderSermons() {
    const categorySermons = this.data[this.currentCategory]

    for (const sermon of categorySermons) {
      const sermonIndex = categorySermons.indexOf(sermon)
      wrap.innerHTML += `
      <article class="card sermon" onClick="app.onClickSermon(${sermonIndex})">
        <h2>${sermon.title}</h2>
        <p class="subtitle reading">
          ${sermon.reading}
        </p>
        <p>
          <strong>Fecha</strong> ${sermon.date}
        </p>
        <p>
          <strong>Autor</strong> ${sermon.author}
        </p>
        <p>
          <strong>Numero</strong> ${sermon.number}
        </p>
      </article>
      `
    }

  }

  // render single sermon
  renderSermon() {
    console.log("renderSermon")

    let videoIframe = ''
    if (this.currentSermon.video) {
      videoIframe = `<iframe src="${this.currentSermon.video}" frameborder="0" ></iframe>`
    }

    let mp3Audio = ''
    if (this.currentSermon.mp3) {
      mp3Audio = `<audio controls>
        <source src="${this.currentSermon.mp3}" type="audio/mp3">
        Tu navegador no soporta el elemento <code>audio</code>.
      </audio>`
    }

    wrap.innerHTML += `
      <article class="sermon-details">
        <p class="subtitle reading">
          ${this.currentSermon.reading}
        </p>
        <p>
          <strong>Fecha</strong> ${this.currentSermon.date}
        </p>
        <p>
          <strong>Autor</strong> ${this.currentSermon.author}
        </p>
        <p>
          <strong>Numero</strong> ${this.currentSermon.number}
        </p>

        ${videoIframe}
        
        ${mp3Audio}
        
      </article>
    ` 
  }

  // Go to sermons page and save category
  onClickCategory(category) {
    this.currentPage = 1
    this.currentCategory = category
    this.refreshRender()
  }

  // go to specific sermon page
  onClickSermon(sermonIndex) {
    const sermon = this.data[this.currentCategory][sermonIndex]
    this.currentPage = 2
    this.currentSermon = sermon
    this.refreshRender()
  }

  goBack() {
    if (this.currentPage === 1) {
        this.currentPage = 0
        this.renderCategories()
    } else if (this.currentPage === 2) {
        this.currentPage = 1
        this.renderSermons()
    }
  }

  refreshRender() {

    this.cleanWrap()
    this.updateMainTitle()

    if (this.currentPage === 0) {
        this.renderCategories()
    } else if (this.currentPage === 1) {
        this.renderSermons()
    } else if (this.currentPage === 2) {
        this.renderSermon()
    }
  }
}

const app = new SermonsApp(sermonsData)
app.refreshRender()