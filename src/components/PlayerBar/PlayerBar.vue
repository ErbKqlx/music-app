<script setup>
    import Image from '@/components/Image.vue';
    import ProgressBar from './ProgressBar.vue';
</script>

<template>
    <div class="player-bar">
        <div class="song-info">
            <div class="song-preview">
                <!-- <img src="" alt="Изображение"> -->
                <Image/>
            </div>
            <div>
                <span class="clickable">Название трека</span>
                <span class='additional-info clickable'>Название исполнителя</span>
            </div>
        </div>
        <!-- Потом заменить компонентами -->
        <div class="main-actions">
            <div class="player-buttons">
                <svg width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.125 0.75L12 2.625L10.125 4.5M2.625 13.25L0.75 11.375L2.625 9.5" stroke="#DBDBDB" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 2.625H5.125C3.96468 2.625 2.85188 3.08594 2.03141 3.90641C1.21094 4.72688 0.75 5.83968 0.75 7M0.75 11.375H7.625C8.78532 11.375 9.89812 10.9141 10.7186 10.0936C11.5391 9.27312 12 8.16032 12 7" stroke="#DBDBDB" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.25 0.939375C11.25 0.767441 11.2027 0.598819 11.1133 0.451954C11.0239 0.305088 10.8958 0.185636 10.7431 0.106661C10.5904 0.0276862 10.4189 -0.00776897 10.2474 0.00417374C10.0759 0.0161164 9.91093 0.0749971 9.77062 0.174375L3.20813 4.82719C3.08622 4.91339 2.98667 5.02745 2.91775 5.15989C2.84883 5.29234 2.81254 5.43932 2.8119 5.58862C2.81126 5.73792 2.84628 5.88522 2.91406 6.01825C2.98184 6.15128 3.0804 6.26619 3.20156 6.35344L9.76406 11.0756C9.90406 11.1766 10.0692 11.237 10.2413 11.2501C10.4135 11.2632 10.5859 11.2285 10.7395 11.1499C10.8932 11.0712 11.0222 10.9517 11.1123 10.8045C11.2023 10.6572 11.25 10.4879 11.25 10.3153V0.939375ZM0 0.46875C0 0.34443 0.0493851 0.225201 0.137293 0.137294C0.225201 0.0493861 0.344429 0 0.46875 0C0.59307 0 0.712298 0.0493861 0.800206 0.137294C0.888114 0.225201 0.9375 0.34443 0.9375 0.46875V10.7812C0.9375 10.9056 0.888114 11.0248 0.800206 11.1127C0.712298 11.2006 0.59307 11.25 0.46875 11.25C0.344429 11.25 0.225201 11.2006 0.137293 11.1127C0.0493851 11.0248 0 10.9056 0 10.7812V0.46875Z" fill="#DBDBDB"/>
                </svg>
                <div class="button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                        <path fill="currentColor" d="m11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393"/>
                    </svg>
                </div>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 0.939375C6.32089e-06 0.767441 0.0472944 0.598819 0.136692 0.451954C0.22609 0.305088 0.354154 0.185636 0.506877 0.106661C0.6596 0.0276862 0.831101 -0.00776897 1.00262 0.00417374C1.17414 0.0161165 1.33907 0.0749971 1.47938 0.174375L8.04187 4.82719C8.16378 4.91339 8.26333 5.02745 8.33225 5.15989C8.40117 5.29234 8.43746 5.43932 8.4381 5.58862C8.43874 5.73792 8.40372 5.88522 8.33594 6.01825C8.26817 6.15128 8.1696 6.26619 8.04844 6.35344L1.48594 11.0756C1.34594 11.1766 1.18077 11.237 1.00865 11.2501C0.836531 11.2632 0.664134 11.2285 0.510462 11.1499C0.356791 11.0712 0.227812 10.9517 0.137741 10.8045C0.0476707 10.6572 5.7467e-06 10.4879 0 10.3153V0.939375ZM11.25 0.46875C11.25 0.34443 11.2006 0.225201 11.1127 0.137294C11.0248 0.0493861 10.9056 0 10.7812 0C10.6569 0 10.5377 0.0493861 10.4498 0.137294C10.3619 0.225201 10.3125 0.34443 10.3125 0.46875V10.7812C10.3125 10.9056 10.3619 11.0248 10.4498 11.1127C10.5377 11.2006 10.6569 11.25 10.7812 11.25C10.9056 11.25 11.0248 11.2006 11.1127 11.1127C11.2006 11.0248 11.25 10.9056 11.25 10.7812V0.46875Z" fill="#DBDBDB"/>
                </svg>                
                <!-- <svg width="8" height="10" viewBox="0 0 8 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 0H1C0.734784 0 0.48043 0.105357 0.292893 0.292893C0.105357 0.48043 0 0.734784 0 1V9C0 9.26522 0.105357 9.51957 0.292893 9.70711C0.48043 9.89464 0.734784 10 1 10H2C2.26522 10 2.51957 9.89464 2.70711 9.70711C2.89464 9.51957 3 9.26522 3 9V1C3 0.734784 2.89464 0.48043 2.70711 0.292893C2.51957 0.105357 2.26522 0 2 0ZM7 0H6C5.73478 0 5.48043 0.105357 5.29289 0.292893C5.10536 0.48043 5 0.734784 5 1V9C5 9.26522 5.10536 9.51957 5.29289 9.70711C5.48043 9.89464 5.73478 10 6 10H7C7.26522 10 7.51957 9.89464 7.70711 9.70711C7.89464 9.51957 8 9.26522 8 9V1C8 0.734784 7.89464 0.48043 7.70711 0.292893C7.51957 0.105357 7.26522 0 7 0Z" fill="black"/>
                </svg> -->
                
                <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.75 13.5H3.681C3.93216 13.4999 4.17928 13.4368 4.39969 13.3163C4.6201 13.1959 4.80675 13.0221 4.9425 12.8107L7.875 8.25L10.8075 3.6885C10.9433 3.47732 11.13 3.30363 11.3504 3.18334C11.5708 3.06304 11.8179 3.00001 12.069 3H15.75M15.75 13.5H12.069C11.8178 13.4999 11.5707 13.4368 11.3503 13.3163C11.1299 13.1959 10.9433 13.0221 10.8075 12.8107L9.32175 10.5M0.75 3H3.681C3.93209 3.00001 4.17917 3.06304 4.39957 3.18334C4.61998 3.30363 4.80666 3.47732 4.9425 3.6885L6.42825 6" stroke="#DBDBDB" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M13.5 0.75L15.75 3L13.5 5.25M13.5 11.25L15.75 13.5L13.5 15.75" stroke="#DBDBDB" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <ProgressBar/>
        </div>
        <div class="misc-buttons">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path fill="currentColor" d="M13.977 4.201a1 1 0 0 1 1.633.645l.095.766c.53 4.242.53 8.534 0 12.776l-.095.766a1 1 0 0 1-1.633.644l-5.019-4.182a.5.5 0 0 0-.32-.116H4.75c-.69 0-1.25-.56-1.25-1.25v-4.5c0-.69.56-1.25 1.25-1.25h3.888a.5.5 0 0 0 .32-.116zm5.055 3.747a.75.75 0 0 0-1.408.517c.405 1.1.626 2.291.626 3.535a10.25 10.25 0 0 1-.626 3.535a.75.75 0 0 0 1.408.517A11.667 11.667 0 0 0 19.75 12c0-1.423-.253-2.788-.718-4.052"/>
            </svg>
            <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.33333 12.6667H6M6 12.6667H7.66667M6 12.6667V1M6 1H1V1.83333M6 1H11V1.83333" stroke="#DBDBDB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </div>
    </div>
</template>

<style scoped>
    .player-bar{
        background-color: black;
        width: 100%;
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        /* margin-top: auto; */
        padding: 20px;

        .song-info{
            display: flex;
            gap: 10px;

            .song-preview{
                aspect-ratio: 1 / 1;
                width: 50px;
            }

            :last-child{
                display: flex;
                flex-direction: column;
                /*justify-content: space-around;*/
                font-size: 14px;
                align-self: center;
                gap: 5px;
            }

            :last-child .additional-info{
                font-size: 12px;
            }
        }

        .main-actions{
            display: flex;
            flex-direction: column;
            width: 50%;
            align-items: center;
            /* justify-content: center; */
            gap: 10px;

            .player-buttons{
                display: flex;
                gap: 15px;
                align-items: center;

                .button{
                    background-color: lightgray;
                    width: 38px;
                    height: 38px;
                    border-radius: 360px;
                    color: black;

                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .button:hover{
                    cursor: pointer;
                }
            }
        }

        .misc-buttons{
            display: flex;
            align-items: center;
            gap: 20px;
        }
    }
</style>