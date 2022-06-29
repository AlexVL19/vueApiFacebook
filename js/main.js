const api = "https://graph.facebook.com/";
const token = "EAAFqECaOem0BAIXYGZAY8fS4IrGfWWh5hiTd7fIFFe38MKkLQ8GcWhrbaZBJVV7dCVhEViyVoMWWV08jrLYyiLpvmUXK932PKtC2bxyNqiOKSZCiebBENhbWhctm1BoxvYbGfANPss6ekQAdLrZBNhreZBwxkZAlvEIasayMBwZAwZDZD";

const app = Vue.createApp({
    data() {
        return {
            search: null,
            result: null,
            error: null,
            favs: new Map()
        }
    },

    created() {
        const savedFavs = JSON.parse(window.localStorage.getItem('misfav'))

        if (savedFavs?.length) {
            const favsRebuild = new Map(savedFavs.map(alias=>[alias.id,alias]))
            this.favs = favsRebuild
        }
    },

    computed: {
        isFavorite() {
            return this.favs.has(this.result.id);
        },

        allFavorites() {
            return Array.from(this.favs.values());
        }
    },

    methods: {
        async buscar() {
            this.result = this.error = null

            try {
                const response = await fetch(api + this.search + "?fields=id,name,email,picture&access_token=" + token);
                if(!response.ok) throw new Error("Usuario no encontrado")
                const data = await response.json();
                console.log(data);
                this.result = data;
            }
            
            catch (error) {
                this.error = error
            }

            finally {
                this.search = null
            }
        },

        addFavs() {
            this.favs.set(this.result.id, this.result)
            this.updateStorage()
        },

        removeFavs() {
            this.favs.delete(this.result.id)
            this.updateStorage()
        },

        updateStorage() {
            window.localStorage.setItem('misfav', JSON.stringify(this.allFavorites))
        },

        showFavorites(par) {
            this.result = par
        }
    }
})