const TOOL_DISCUSSION_IDS = {
  primer: 1
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

        const url = "https://giscus.app/api/discussions?repo=giscus%2Fgiscus&term=Welcome+to+giscus%21&number=0&strict=true&last=15"
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
        script.dataset.repo = "namiwang/fiber-note"
        script.dataset.repoId = "MDEwOlJlcG9zaXRvcnkyNzE3OTkyNzk="
        script.dataset.mapping = "number"
        script.dataset.term = "340"
        script.dataset.reactionsEnabled = "1"
        script.dataset.emitMetadata = "0"
        script.dataset.inputPosition = "top"
        script.dataset.theme = "preferred_color_scheme"
        script.dataset.lang = "en"
        script.crossorigin = "anonymous"
        script.async = true

        script.onload = () => {
          console.log('Remote script has been loaded and executed.');
        }
        script.onerror = () => {
          console.error('Failed to load the remote script.');
        }

        document.querySelector('#comments-panel').appendChild(script)
      })
    },
    closeCommentsPanel() {
      this.isPanelOpen = false
      this.selectedTool = null
    },
  }
}
