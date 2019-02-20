class SharedService {
    public isInRequest: boolean = false;
    makeRequest () {
        setTimeout(() => this.isInRequest = true)
    }
    stopRequest () {
        setTimeout(() => this.isInRequest = false)
    }
}

export const sharedService = new SharedService();