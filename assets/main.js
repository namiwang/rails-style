const TOOL_DISCUSSION_IDS = {
  primer: 2,
  polaris: 3,
  govuk: 5,
  csszero: 6,
  railsdesigner: 7,
  railsui: 8,
  rubyui: 9,
  zestui: 10,
  protos: 11,
  shadcnonrails: 12,
}

const EMOJI_MAP = {
  THUMBS_UP: '👍',
  THUMBS_DOWN: '👎',
  LAUGH: '😂',
  HOORAY: '🎉',
  CONFUSED: '😕',
  HEART: '❤️',
  ROCKET: '🚀',
  EYES: '👀',
}

function toolReactions(tool) {
  return {
    commentsCount: 0,
    reactions: {},
    isLoading: true,
    async fetchData() {
      try {
        if (!tool) return

        const discussionId = TOOL_DISCUSSION_IDS[tool]
        if (!discussionId) return

        const url = `https://reactions.api.rails.style/?discussionId=${discussionId}`
        const response = await fetch(url)
        const data = await response.json()

        this.commentsCount = data.discussion.totalCommentCount

        // sample
        // {
        //   "THUMBS_UP": {
        //       "count": 565,
        //       "viewerHasReacted": false
        //   }
        //   ...
        // }
        this.reactions = data.discussion.reactions

        this.isLoading = false
      } catch (error) {
        // console.error(`Error fetching discussion`, error)
      }
    },
    init() {
      this.fetchData()
    },
    getEmoji(emoji) {
      return EMOJI_MAP[emoji]
    },
  }
}

function commentsPanel() {
  return {
    isPanelOpen: false,
    selectedTool: null,
    openCommentsPanel(tool) {
      this.isPanelOpen = true
      this.selectedTool = tool

      this.$nextTick(() => {
        const script = document.createElement('script')
        script.src = "https://giscus.app/client.js"
        script.dataset.repo = "namiwang/rails-style"
        script.dataset.repoId = "R_kgDONjz4uw"
        script.dataset.mapping = "number"
        script.dataset.term = TOOL_DISCUSSION_IDS[tool]
        script.dataset.reactionsEnabled = "1"
        script.dataset.emitMetadata = "0"
        script.dataset.inputPosition = "top"
        script.dataset.theme = "light"
        script.dataset.lang = "en"
        // script.dataset.loading = "lazy"
        script.crossorigin = "anonymous"
        script.async = true

        // script.onload = () => {
        //   console.log('Remote script loaded and executed')
        // }
        // script.onerror = () => {
        //   console.error('Failed to load the remote script')
        // }

        document.querySelector('#comments-panel').appendChild(script)
      })
    },
    closeCommentsPanel() {
      this.isPanelOpen = false
      this.selectedTool = null
    },
  }
}
