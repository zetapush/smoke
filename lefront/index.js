const $file = document.querySelector('[type="file"]')

const upload = ({ file, url, httpMethod, guid, tags }) => {
  return $.ajax({
    // url: securize(url),
    url,
    method: httpMethod,
    contentType: false,
    processData: false,
    data: file,
    headers: {
      'Content-Type': file.type
    }
  })
}

const main = async () => {
  try {
    const client = new ZetaPushClient.WeakClient({
      appName: "4tqe3qvw2",
      platformUrl: "http://hq.zpush.io:9080/zbo/pub/business/"
    });
    await client.connect()
    const api = client.createProxyTaskService();
    const macro = client.createService({
      Type: ZetaPush.services.Macro,
      listener: {
        uploadFile({ data: { result } }) {
          const [file] = $file.files
          const { url, httpMethod, guid } = result
          const tags = []
          upload({ file, url, httpMethod, guid, tags }).then(() => {
            // $form.reset()
            macro.call({ name: 'addFile', parameters: { guid, tags } })
          })
        },
        addFile({ data: { result } }) {
          macro.call({ name: 'listFiles' })
        },
        listFiles({ data: { result } }) {
          const cards = result.listing.entries.content
          for (let card of cards) {
            $("#cunt").append(`
              <img src="${card.url.url}" width="200px">
            `)
          }
        },
        chien(data){
          console.log("DATA", data);
          if (data.data.result.gda.result.chien === "vive les chiens GDA"){
            $("#gda").css("display", "block")
            $("#gda2").css("display", "none")
          }
          if (data.data.result.search.data.name === "ce sont des super chiens de search"){
            $("#search").css("display", "block")
            $("#search2").css("display", "none")
          }
          $("#loading").css("display", "none")
        }
      }
    })

    const fs = client.createService({
      Type: ZetaPush.services.Zpfs_hdfs,
      listener: {
        async thumbnail(data) {
          $("#thumb").css("display", "block")
          $("#thumb2").css("display", "none")
          const res = await macro.call({ name: "chien", parameters: {} })
        }
      }
    })

    $("#form").submit((e) => {
      e.preventDefault()
      $("#loading").css("display", "block")
      macro.call({ name: 'uploadFile' })
    })

  } catch (error) {
    console.error(error);
  }
}

main()