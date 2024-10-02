/* eslint-disable @typescript-eslint/no-explicit-any */

import 'abort-controller/polyfill';

import Fuse from '../../../node_modules/fuse.js/dist/fuse';

import {
    downloadFile, filterAuthorChat, filterAuthorComments, filterHeartComments, filterChatNewestFirst,
    filterDonatedChat, filterVerifiedComments, filterVerifiedChatComments, filterLikesComments,
    filterLinksTrpVideoComments, filterMemberComments, filterMembersChat, filterNewestFirst,
    filterRepliedComments, filterLinksChatComments, getAllCommentsModeV2, getChatComments,
    getCleanUrlVideo, filterLinksComments, getCommentsChatHtmlText, getCommentsHtmlText,
    getCommentsTrVideoHtmlText, getRandomComment, filterAllTrpVideoComments,
    getTranscriptVideo, GlobalStore, initShowBarFAQ, initShowViewMode, isWatchVideo, openComments,
    openCommentsChat, openCommentsTrVideo, removeClass, removeNodeList, sendGetCacheInIDB,
    sendMsgToBadge, setCacheToIDB, showLoadComments, wrapTryCatch
} from '../utils/assist';

import { ICommentsFuseResult, IParamSearch, ISelectedSearch } from '../utils/interfaces/i_types';

import {
    iconCollapse, iconExpand, iconOk, iconReload, iconSortDown, iconSortUp, renderComment,
    renderCommentChat, renderCommentTrVideo, renderLoadComments, renderSearch
} from '../utils/renderView';

(function (): void {

    const intervalCheckLoadDOM = setInterval(() => {

        if (isWatchVideo() && document.querySelector('#meta.style-scope.ytd-watch-flexy')) {
            clearInterval(intervalCheckLoadDOM);

            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            initApp();
        }

    }, 1000);

    function initApp(): void {

        let controller: AbortController;

        let handleMessageEvent: (ev: MessageEvent<any>) => unknown;

        function app(): void {

            if (!isWatchVideo()) return;

            if (handleMessageEvent) {
                window.removeEventListener('message', handleMessageEvent);
            }

            const countComments = {
                comments: 0,
                commentsChat: 0,
                commentsTrVideo: 0
            };

            const countSearchComments = {
                comments: 0,
                commentsChat: 0,
                commentsTrVideo: 0
            };

            let comments: object[] = [];
            let commentsChat = new Map<number, object>();
            let commentsTrVideo: object | undefined;

            controller = new AbortController();

            const fuseOptions = {
                isCaseSensitive: false,
                findAllMatches: false,
                includeMatches: false,
                includeScore: true,
                ignoreLocation: true,
                useExtendedSearch: false,
                minMatchCharLength: 1,
                shouldSort: true,
                threshold: 0.15,
                distance: 100000
            };

            

            sendMsgToBadge('NUMBER_COMMENTS', '');

            removeNodeList('.ycs-app');

            if (document.querySelector('#meta.style-scope.ytd-watch-flexy')) {
                renderLoadComments('#meta.style-scope.ytd-watch-flexy');
            } else if (document.querySelector('#meta.style-scope')) {
                renderLoadComments('#meta.style-scope');
            } else {
                return;
            }

            const elSearch = document.getElementById('ycs-search');
            if (elSearch) {
                renderSearch(elSearch);
            }

            const getElmsBtnPanel = (): object => {

                return {
                    elPTimeStamps: document.getElementById('ycs_btn_timestamps'),
                    elPAuthor: document.getElementById('ycs_btn_author'),
                    elPHeart: document.getElementById('ycs_btn_heart'),
                    elPVerified: document.getElementById('ycs_btn_verified'),
                    elPLinks: document.getElementById('ycs_btn_links'),
                    elPLikes: document.getElementById('ycs_btn_likes'),
                    elPReplied: document.getElementById('ycs_btn_replied_comments'),
                    elPMembers: document.getElementById('ycs_btn_members'),
                    elPDonated: document.getElementById('ycs_btn_donated'),
                    elPClear: document.getElementById('ycs_btn_clear'),
                    elPRandom: document.getElementById('ycs_btn_random'),
                    elFirstComments: document.getElementById('ycs_btn_sort_first')
                };

            };

            const elsBtnPanel = getElmsBtnPanel();
            console.log('elsBtnPanel: ', elsBtnPanel);

            const handlersBtnPanel = (hElms: any): void => {

                if (hElms) {

                    const clearCountComments = (): void => {
                        countSearchComments.comments = 0;
                        countSearchComments.commentsChat = 0;
                        countSearchComments.commentsTrVideo = 0;
                    };

                    hElms?.elPTimeStamps?.addEventListener('click', (e: Event) => {

                        try {

                            const currentTarget = e.currentTarget;

                            removeClass(elsBtnPanel, 'ycs_btn_active');

                            clearCountComments();

                            (currentTarget as HTMLElement)?.classList.add('ycs_btn_active');

                            // eslint-disable-next-line @typescript-eslint/no-use-before-define
                            searchCommentsAll('#ycs-search-result', {
                                timestamp: true
                            });

                        } catch (err) {
                            console.error(err);
                        }

                    });

                    hElms?.elPAuthor?.addEventListener('click', (e: Event) => {

                        try {

                            const currentTarget = e.currentTarget;

                            removeClass(elsBtnPanel, 'ycs_btn_active');

                            clearCountComments();

                            (currentTarget as HTMLElement)?.classList.add('ycs_btn_active');

                            // eslint-disable-next-line @typescript-eslint/no-use-before-define
                            searchCommentsAll('#ycs-search-result', {
                                author: true
                            });

                        } catch (err) {
                            console.error(err);
                        }

                    });

                    hElms?.elPHeart?.addEventListener('click', (e: Event) => {

                        try {

                            const currentTarget = e.currentTarget;

                            removeClass(elsBtnPanel, 'ycs_btn_active');

                            clearCountComments();

                            (currentTarget as HTMLElement)?.classList.add('ycs_btn_active');

                            // eslint-disable-next-line @typescript-eslint/no-use-before-define
                            searchCommentsAll('#ycs-search-result', {
                                heart: true
                            });

                        } catch (err) {
                            console.error(err);
                        }

                    });

                    hElms?.elPVerified?.addEventListener('click', (e: Event) => {

                        try {

                            const currentTarget = e.currentTarget;

                            removeClass(elsBtnPanel, 'ycs_btn_active');

                            clearCountComments();

                            (currentTarget as HTMLElement)?.classList.add('ycs_btn_active');

                            // eslint-disable-next-line @typescript-eslint/no-use-before-define
                            searchCommentsAll('#ycs-search-result', {
                                verified: true
                            });

                        } catch (err) {
                            console.error(err);
                        }

                    });

                    hElms?.elPLinks?.addEventListener('click', (e: Event) => {

                        try {

                            const currentTarget = e.currentTarget;

                            removeClass(elsBtnPanel, 'ycs_btn_active');

                            clearCountComments();

                            (currentTarget as HTMLElement)?.classList.add('ycs_btn_active');

                            // eslint-disable-next-line @typescript-eslint/no-use-before-define
                            searchCommentsAll('#ycs-search-result', {
                                links: true
                            });

                        } catch (err) {
                            console.error(err);
                        }

                    });

                    hElms?.elPLikes?.addEventListener('click', (e: Event) => {

                        try {

                            const currentTarget = e.currentTarget;

                            removeClass(elsBtnPanel, 'ycs_btn_active');

                            clearCountComments();

                            (currentTarget as HTMLElement)?.classList.add('ycs_btn_active');

                            // eslint-disable-next-line @typescript-eslint/no-use-before-define
                            searchCommentsAll('#ycs-search-result', {
                                likes: true
                            });

                        } catch (err) {
                            console.error(err);
                        }

                    });

                    hElms?.elPReplied?.addEventListener('click', (e: Event) => {

                        try {

                            const currentTarget = e.currentTarget;

                            removeClass(elsBtnPanel, 'ycs_btn_active');

                            clearCountComments();

                            (currentTarget as HTMLElement)?.classList.add('ycs_btn_active');

                            // eslint-disable-next-line @typescript-eslint/no-use-before-define
                            searchCommentsAll('#ycs-search-result', {
                                replied: true
                            });

                        } catch (err) {
                            console.error(err);
                        }

                    });

                    hElms?.elPMembers?.addEventListener('click', (e: Event) => {

                        try {

                            const currentTarget = e.currentTarget;

                            removeClass(elsBtnPanel, 'ycs_btn_active');

                            clearCountComments();

                            (currentTarget as HTMLElement)?.classList.add('ycs_btn_active');

                            // eslint-disable-next-line @typescript-eslint/no-use-before-define
                            searchCommentsAll('#ycs-search-result', {
                                members: true
                            });

                        } catch (err) {
                            console.error(err);
                        }

                    });

                    hElms?.elPDonated?.addEventListener('click', (e: Event) => {

                        try {

                            const currentTarget = e.currentTarget;

                            removeClass(elsBtnPanel, 'ycs_btn_active');

                            clearCountComments();

                            (currentTarget as HTMLElement)?.classList.add('ycs_btn_active');

                            // eslint-disable-next-line @typescript-eslint/no-use-before-define
                            searchCommentsAll('#ycs-search-result', {
                                donated: true
                            });

                        } catch (err) {
                            console.error(err);
                        }

                    });

                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    hElms?.elPClear?.addEventListener('click', (e: Event) => {

                        try {

                            // const currentTarget = e.currentTarget;

                            removeClass(elsBtnPanel, 'ycs_btn_active');

                            clearCountComments();

                            // (currentTarget as HTMLElement)?.classList.add('ycs_btn_active');

                            const elSearchRes = document.getElementById('ycs-search-result');
                            const elSearchTotalRes: any = document.getElementById('ycs-search-total-result');

                            if (elSearchRes) {
                                elSearchRes.innerText = '';

                                elSearchTotalRes.innerText = 'Search cleared';
                            }

                        } catch (err) {
                            console.error(err);
                        }

                    });

                    hElms?.elPRandom?.addEventListener('click', (e: Event) => {

                        try {

                            const currentTarget = e.currentTarget;

                            removeClass(elsBtnPanel, 'ycs_btn_active');

                            clearCountComments();

                            (currentTarget as HTMLElement)?.classList.add('ycs_btn_active');

                            // eslint-disable-next-line @typescript-eslint/no-use-before-define
                            searchCommentsAll('#ycs-search-result', {
                                random: true
                            });

                        } catch (err) {
                            console.error(err);
                        }

                    });

                    hElms?.elFirstComments?.addEventListener('click', (e: Event) => {

                        try {

                            const currentTarget = e.currentTarget;

                            removeClass(elsBtnPanel, 'ycs_btn_active');

                            clearCountComments();

                            (currentTarget as HTMLElement)?.classList.add('ycs_btn_active');

                            // eslint-disable-next-line @typescript-eslint/no-use-before-define
                            searchCommentsAll('#ycs-search-result', {
                                sortFirst: true
                            });

                        } catch (err) {
                            console.error(err);
                        }

                    });

                }

            };

            handlersBtnPanel(elsBtnPanel);

            const elLiveApp = document.getElementsByClassName('ycs-app')[0];

            const elCountComments = document.getElementById('ycs-count-load');

            const elLoadComments = document.getElementById('ycs-load-cmnts');
            if (elLoadComments) {

                elLoadComments.addEventListener('click', async function (e: MouseEvent): Promise<void> {

                    if (!elLiveApp.parentNode || !elLiveApp.parentElement) return;
                    console.log('CLICK');

                    comments.length = 0;

                    const currentTarget = e.currentTarget as HTMLButtonElement;

                    currentTarget.disabled = true;
                    currentTarget.innerText = 'reload';

                    const elStatusCmnts = document.getElementById('ycs_status_cmnt');
                    const elLoadCmnts = document.getElementById('ycs_cmnts');

                    if (elLoadCmnts && elStatusCmnts) {

                        elLoadCmnts.textContent = '0';

                        elStatusCmnts.innerHTML = iconReload();

                        await getAllCommentsModeV2(elLoadCmnts, controller.signal, comments);

                        console.log('ORIGIN COMMENTS: ', comments);

                        if (comments.length > 0) {
                            elStatusCmnts.innerHTML = iconOk();
                            setCacheToIDB({ comments, commentsChat: JSON.stringify(Array.from(commentsChat.entries())), commentsTrVideo }, window.location.href, document.title);
                        }

                    }


                    if (comments.length > 0) {
                        countComments.comments = comments.length;
                    }

                    const totalCount = countComments.comments + countComments.commentsChat + countComments.commentsTrVideo;
                    sendMsgToBadge('NUMBER_COMMENTS', totalCount);

                    if (elLoadCmnts) {
                        elLoadCmnts.textContent = `${comments.length}`;
                    }

                    if (elCountComments) {
                        elCountComments.textContent = `(${totalCount})`;
                    }

                    currentTarget.disabled = false;
                });

            }

            const elLoadCommentsChat = document.getElementById('ycs-load-chat');
            if (elLoadCommentsChat) {

                elLoadCommentsChat.addEventListener('click', async function (e: MouseEvent): Promise<void> {

                    if (!elLiveApp.parentNode || !elLiveApp.parentElement) return;

                    commentsChat.clear();

                    const currentTarget = e.currentTarget as HTMLButtonElement;

                    currentTarget.disabled = true;
                    currentTarget.innerText = 'reload';

                    const elStatusChat = document.getElementById('ycs_status_chat');
                    const elLoadChat = document.getElementById('ycs_cmnts_chat');

                    if (elLoadChat && elStatusChat) {

                        elLoadChat.textContent = '0';

                        elStatusChat.innerHTML = iconReload();

                        await getChatComments(controller.signal, elLoadChat, commentsChat);

                        console.log('CHAT COMMENTS: ', commentsChat);

                        if (commentsChat && commentsChat.size > 0) {
                            elLoadChat.textContent = commentsChat.size.toString();
                            elStatusChat.innerHTML = iconOk();
                            setCacheToIDB({ comments, commentsChat: JSON.stringify(Array.from(commentsChat.entries())), commentsTrVideo }, window.location.href, document.title);
                        }

                    }

                    if ((commentsChat && commentsChat.size > 0) && (elLiveApp.parentNode || elLiveApp.parentElement)) {

                        countComments.commentsChat = commentsChat.size;

                    }

                    const totalCount = countComments.comments + countComments.commentsChat + countComments.commentsTrVideo;
                    sendMsgToBadge('NUMBER_COMMENTS', totalCount);

                    if (elCountComments) {
                        elCountComments.textContent = `(${totalCount})`;
                    }


                    currentTarget.disabled = false;

                });

            }

            const elLoadTranscriptVideo = document.getElementById('ycs-load-transcript-video');
            if (elLoadTranscriptVideo) {

                elLoadTranscriptVideo.addEventListener('click', async function (e: MouseEvent): Promise<void> {

                    if (!elLiveApp.parentNode || !elLiveApp.parentElement) return;

                    const currentTarget = e.currentTarget as HTMLButtonElement;

                    currentTarget.disabled = true;
                    currentTarget.innerText = 'reload';

                    const elStatusTrVideo = document.getElementById('ycs_status_trvideo');
                    const elLoadTrVideo = document.getElementById('ycs_cmnts_video');

                    if (elLoadTrVideo && elStatusTrVideo) {

                        elLoadTrVideo.textContent = '0';

                        elStatusTrVideo.innerHTML = iconReload();

                        commentsTrVideo = await getTranscriptVideo(controller.signal);

                        try {
                            if (commentsTrVideo && elLoadTrVideo && (commentsTrVideo as any)?.actions?.length > 0 &&
                                (commentsTrVideo as any)?.actions[0]?.updateEngagementPanelAction?.content?.transcriptRenderer?.body?.transcriptBodyRenderer?.cueGroups?.length > 0) {
                                showLoadComments((commentsTrVideo as any).actions[0].updateEngagementPanelAction.content.transcriptRenderer.body.transcriptBodyRenderer.cueGroups.length, elLoadTrVideo);
                                setCacheToIDB({ comments, commentsChat: JSON.stringify(Array.from(commentsChat.entries())), commentsTrVideo }, window.location.href, document.title);
                            } else {
                                commentsTrVideo = undefined;
                            }
                        } catch (err) {
                            console.error(err);
                            commentsTrVideo = undefined;
                        }

                        console.log('Transcript: ', commentsTrVideo);

                        if (wrapTryCatch(() => (commentsTrVideo as any)?.actions[0]?.updateEngagementPanelAction?.content?.transcriptRenderer?.body?.transcriptBodyRenderer?.cueGroups?.length > 0)) {
                            elStatusTrVideo.innerHTML = iconOk();

                        }

                    }

                    if (wrapTryCatch(() => (commentsTrVideo as any)?.actions[0]?.updateEngagementPanelAction?.content?.transcriptRenderer?.body?.transcriptBodyRenderer?.cueGroups?.length > 0) && (elLiveApp.parentNode || elLiveApp.parentElement)) {

                        countComments.commentsTrVideo = (commentsTrVideo as any).actions[0].updateEngagementPanelAction.content.transcriptRenderer.body.transcriptBodyRenderer.cueGroups.length;

                    }

                    const totalCount = countComments.comments + countComments.commentsChat + countComments.commentsTrVideo;
                    sendMsgToBadge('NUMBER_COMMENTS', totalCount);

                    if (elCountComments) {
                        elCountComments.textContent = `(${totalCount})`;
                    }

                    currentTarget.disabled = false;

                });

            }

            const elLoadAll = document.getElementById('ycs-load-all');
            if (elLoadAll) {

                elLoadAll.addEventListener('click', function (): void {

                    const eLoadComments = document.getElementById('ycs-load-cmnts');
                    const eLoadCommentsChat = document.getElementById('ycs-load-chat');
                    const eLoadTranscriptVideo = document.getElementById('ycs-load-transcript-video');

                    eLoadComments?.click();
                    eLoadCommentsChat?.click();
                    eLoadTranscriptVideo?.click();

                });

            }

            const elLoadAllStop = document.getElementById('ycs_load_stop');
            if (elLoadAllStop) {

                elLoadAllStop.addEventListener('click', () => {

                    try {

                        controller.abort();
                        controller = new AbortController();

                    } catch (err) {
                        console.error(err);
                    }

                });

            }

            const btnSearch = document.getElementById('ycs_btn_search');
            const eInputSearch = document.getElementById('ycs-input-search');

            if (eInputSearch) {
                eInputSearch.onkeyup = (e): void => {
                    if (e.key === 'Enter' || e.code === 'Enter') {
                        btnSearch?.click();
                    }
                };
            }


            const btnOpenCommentsNewWindow = document.getElementById('ycs_open_all_comments_window');
            btnOpenCommentsNewWindow?.addEventListener('click', () => {
                if (comments.length === 0) return;

                try {
                    openComments(getCommentsHtmlText(comments));
                } catch (e) {
                    console.error(e);
                    return;
                }

            });

            const btnSaveCommentsToFile = document.getElementById('ycs_save_all_comments');
            btnSaveCommentsToFile?.addEventListener('click', () => {
                if (comments.length === 0) return;

                try {

                    const c = getCommentsHtmlText(comments);
                    const htmlText = `
YCS - YouTube Comment Search

Comments
File created by ${new Date().toString()}
Video URL: ${getCleanUrlVideo(window.location.href)}
Title: ${document.title}
Total: ${c.count}\n${c.html}`;

                    downloadFile(htmlText, `Comments, ${document.title} (${c.count}).txt`, 'text/plain');

                } catch (e) {
                    console.error(e);
                    return;
                }


            });

            const btnOpenCommentsChatNewWindow = document.getElementById('ycs_open_all_comments_chat_window');
            btnOpenCommentsChatNewWindow?.addEventListener('click', () => {
                if (commentsChat.size === 0) return;

                try {
                    openCommentsChat(getCommentsChatHtmlText([...commentsChat.values()]));
                } catch (e) {
                    console.error(e);
                    return;
                }

            });

            const btnSaveCommentsChatToFile = document.getElementById('ycs_save_all_comments_chat');
            btnSaveCommentsChatToFile?.addEventListener('click', () => {
                if (commentsChat.size === 0) return;

                try {
                    const c = getCommentsChatHtmlText([...commentsChat.values()]);
                    const htmlText = `
YCS - YouTube Comment Search

Comments chat
File created by ${new Date().toString()}
Video URL: ${getCleanUrlVideo(window.location.href)}
Title: ${document.title}
Total: ${c.count}\n${c.html}`;

                    downloadFile(htmlText, `Comments chat, ${document.title} (${c.count}).txt`, 'text/plain');
                } catch (e) {
                    console.error(e);
                    return;
                }

            });

            const btnOpenCommentsTrVideoNewWindow = document.getElementById('ycs_open_all_comments_trvideo_window');
            btnOpenCommentsTrVideoNewWindow?.addEventListener('click', () => {

                try {

                    console.log('commentsTrVideo: ', commentsTrVideo);

                    if (commentsTrVideo && (commentsTrVideo as any)?.actions?.length > 0 &&
                        (commentsTrVideo as any)?.actions[0]?.updateEngagementPanelAction?.content?.transcriptRenderer?.body?.transcriptBodyRenderer?.cueGroups?.length > 0) {

                        openCommentsTrVideo(getCommentsTrVideoHtmlText((commentsTrVideo as any).actions[0].updateEngagementPanelAction.content.transcriptRenderer.body.transcriptBodyRenderer.cueGroups));
                    }

                } catch (e) {
                    console.error(e);
                    return;
                }

            });

            const btnSaveCommentsTrVideoToFile = document.getElementById('ycs_save_all_comments_trvideo');
            btnSaveCommentsTrVideoToFile?.addEventListener('click', () => {

                try {

                    if (commentsTrVideo && (commentsTrVideo as any)?.actions?.length > 0 &&
                        (commentsTrVideo as any).actions[0]?.updateEngagementPanelAction?.content?.transcriptRenderer?.body?.transcriptBodyRenderer?.cueGroups?.length > 0) {

                        const c = getCommentsTrVideoHtmlText((commentsTrVideo as any).actions[0].updateEngagementPanelAction.content.transcriptRenderer.body.transcriptBodyRenderer.cueGroups);

                        const htmlText = `
YCS - YouTube Comment Search

Transcript video
File created by ${new Date().toString()}
Video URL: ${getCleanUrlVideo(window.location.href)}
Title: ${document.title}
Total: ${c.count}\n${c.html}`;

                        downloadFile(htmlText, `Transcript video, ${document.title} (${c.count}).txt`, 'text/plain');
                    }


                } catch (e) {
                    console.error(e);
                    return;
                }

            });

            const searchComments = (selector: string, param?: IParamSearch): void => {

                try {

                    if (comments.length === 0 || param?.donated) return;

                    const inputSearch = document.getElementById('ycs-input-search') as HTMLInputElement;
                    const querySearch: string = inputSearch?.value;

                    const elSearchRes = document.querySelector(selector);

                    if (elSearchRes) elSearchRes.textContent = '';

                    const elExtSearchTitle = document.getElementById('ycs_extended_search_title') as HTMLInputElement;
                    const elExtSearchMain = document.getElementById('ycs_extended_search_main') as HTMLInputElement;

                    let fuseOpt = fuseOptions;
                    let keysOpt = [
                        'commentRenderer.authorText.simpleText',
                        'commentRenderer.contentText.fullText'
                    ];

                    if (elExtSearch.checked) {
                        fuseOpt = JSON.parse(JSON.stringify(fuseOptions));
                        fuseOpt.useExtendedSearch = true;

                        if (elExtSearchTitle.checked) {
                            keysOpt = [
                                'commentRenderer.authorText.simpleText'
                            ];
                        }

                        if (elExtSearchMain.checked) {
                            keysOpt = [
                                'commentRenderer.contentText.fullText'
                            ];
                        }

                    }

                    const options: object = {
                        ...fuseOpt,
                        keys: keysOpt
                    };

                    let resultSearch: ICommentsFuseResult[] = [];

                    if (param?.likes) {

                        const cmntsLikes = filterLikesComments(comments);
                        resultSearch = cmntsLikes;
                        renderComment(selector, resultSearch, true, querySearch);

                        console.log('cmntsLikes: ', cmntsLikes);

                    } else if (param?.links) {

                        const cmntsLinked = filterLinksComments(comments);
                        resultSearch = cmntsLinked;

                        if (resultSearch.length > 0) {

                            console.log('Links before: ', resultSearch);

                            resultSearch?.sort((firstItem, secondItem) => {

                                return firstItem.refIndex - secondItem.refIndex;

                            });

                            console.log('Links after: ', resultSearch);

                            const elSortLinks = document.getElementById('ycs_btn_links') as HTMLElement;
                            const sortType = elSortLinks.dataset.sort as 'newest' | 'oldest';

                            if (sortType === 'newest') {
                                renderComment(selector, resultSearch, true, querySearch);

                                elSortLinks.dataset.sort = 'oldest';
                                elSortLinks.innerHTML = `Links ${iconSortDown()}`;
                                elSortLinks.title = 'Shows links in comments, replies, chat, video transcript (Newest)';

                            } else if (sortType === 'oldest') {
                                renderComment(selector, resultSearch?.reverse(), true, querySearch);

                                elSortLinks.dataset.sort = 'newest';
                                elSortLinks.innerHTML = `Links ${iconSortUp()}`;
                                elSortLinks.title = 'Shows links in comments, replies, chat, video transcript (Oldest)';

                            } else {
                                renderComment(selector, resultSearch, true, querySearch);
                                elSortLinks.innerHTML = `Links ${iconSortDown()}`;
                            }

                        }

                    } else if (param?.members) {

                        const cmntsMembers = filterMemberComments(comments);
                        resultSearch = cmntsMembers;

                        if (resultSearch.length > 0) {

                            console.log('members before: ', resultSearch);

                            resultSearch?.sort((firstItem, secondItem) => {

                                return firstItem.refIndex - secondItem.refIndex;

                            });

                            console.log('members after: ', resultSearch);

                            const elSortMembers = document.getElementById('ycs_btn_members') as HTMLElement;
                            const sortType = elSortMembers.dataset.sort as 'newest' | 'oldest';

                            if (sortType === 'newest') {
                                renderComment(selector, resultSearch, true, querySearch);

                                elSortMembers.dataset.sort = 'oldest';
                                elSortMembers.innerHTML = `Members ${iconSortDown()}`;
                                elSortMembers.title = 'Show comments, replies, chat from channel members (Newest)';

                            } else if (sortType === 'oldest') {
                                renderComment(selector, resultSearch?.reverse(), true, querySearch);

                                elSortMembers.dataset.sort = 'newest';
                                elSortMembers.innerHTML = `Members ${iconSortUp()}`;
                                elSortMembers.title = 'Show comments, replies, chat from channel members (Oldest)';

                            } else {
                                renderComment(selector, resultSearch, true, querySearch);
                                elSortMembers.innerHTML = `Members ${iconSortDown()}`;
                            }

                            console.log('cmntsMembers: ', cmntsMembers);
                        }

                    } else if (param?.replied) {

                        const cmntsReplied = filterRepliedComments(comments);
                        resultSearch = cmntsReplied;
                        renderComment(selector, resultSearch, true, querySearch);

                        console.log('cmntsReplied: ', cmntsReplied);

                    } else if (param?.author) {
                        const cmntsAuthor = filterAuthorComments(comments);
                        resultSearch = cmntsAuthor;

                        if (resultSearch.length > 0) {

                            console.log('author before: ', resultSearch);

                            resultSearch?.sort((firstItem, secondItem) => {

                                return firstItem.refIndex - secondItem.refIndex;

                            });

                            console.log('author after: ', resultSearch);

                            const elSortAuthor = document.getElementById('ycs_btn_author') as HTMLElement;
                            const sortType = elSortAuthor.dataset.sort as 'newest' | 'oldest';

                            if (sortType === 'newest') {
                                renderComment(selector, resultSearch, true, querySearch);

                                elSortAuthor.dataset.sort = 'oldest';
                                elSortAuthor.innerHTML = `Author ${iconSortDown()}`;
                                elSortAuthor.title = 'Show comments, replies, chat from the author (Newest)';

                            } else if (sortType === 'oldest') {
                                renderComment(selector, resultSearch?.reverse(), true, querySearch);

                                elSortAuthor.dataset.sort = 'newest';
                                elSortAuthor.innerHTML = `Author ${iconSortUp()}`;
                                elSortAuthor.title = 'Show comments, replies, chat from the author (Oldest)';

                            } else {
                                renderComment(selector, resultSearch, true, querySearch);
                                elSortAuthor.innerHTML = `Author ${iconSortDown()}`;
                            }

                        }

                    } else if (param?.heart) {
                        const cmntsHeart = filterHeartComments(comments);
                        resultSearch = cmntsHeart;

                        if (resultSearch.length > 0) {

                            console.log('heart before: ', resultSearch);

                            resultSearch?.sort((firstItem, secondItem) => {

                                return firstItem.refIndex - secondItem.refIndex;

                            });

                            console.log('heart after: ', resultSearch);

                            const elSortHeart = document.getElementById('ycs_btn_heart') as HTMLElement;
                            const sortType = elSortHeart.dataset.sort as 'newest' | 'oldest';

                            if (sortType === 'newest') {
                                renderComment(selector, resultSearch, true, querySearch);

                                elSortHeart.dataset.sort = 'oldest';
                                elSortHeart.innerHTML = `<span class="ycs-creator-heart_icon">❤</span> ${iconSortDown()}`;
                                elSortHeart.title = 'Show comments and replies that the author likes (Newest)';

                            } else if (sortType === 'oldest') {
                                renderComment(selector, resultSearch?.reverse(), true, querySearch);

                                elSortHeart.dataset.sort = 'newest';
                                elSortHeart.innerHTML = `<span class="ycs-creator-heart_icon">❤</span> ${iconSortUp()}`;
                                elSortHeart.title = 'Show comments and replies that the author likes (Oldest)';

                            } else {
                                renderComment(selector, resultSearch, true, querySearch);
                                elSortHeart.innerHTML = `<span class="ycs-creator-heart_icon">❤</span> ${iconSortDown()}`;
                            }

                        }

                    } else if (param?.verified) {
                        const cmntsVerified = filterVerifiedComments(comments);
                        resultSearch = cmntsVerified;

                        if (resultSearch.length > 0) {

                            console.log('verified before: ', resultSearch);

                            resultSearch?.sort((firstItem, secondItem) => {

                                return firstItem.refIndex - secondItem.refIndex;

                            });

                            console.log('verified after: ', resultSearch);

                            const elSortVerified = document.getElementById('ycs_btn_verified') as HTMLElement;
                            const sortType = elSortVerified.dataset.sort as 'newest' | 'oldest';

                            if (sortType === 'newest') {
                                renderComment(selector, resultSearch, true, querySearch);

                                elSortVerified.dataset.sort = 'oldest';
                                elSortVerified.innerHTML = `<span class="ycs-creator-verified_icon">✔</span> ${iconSortDown()}`;
                                elSortVerified.title = 'Show comments,  replies and chat from a verified authors (Newest)';

                            } else if (sortType === 'oldest') {
                                renderComment(selector, resultSearch?.reverse(), true, querySearch);

                                elSortVerified.dataset.sort = 'newest';
                                elSortVerified.innerHTML = `<span class="ycs-creator-verified_icon">✔</span> ${iconSortUp()}`;
                                elSortVerified.title = 'Show comments,  replies and chat from a verified authors (Oldest)';

                            } else {
                                renderComment(selector, resultSearch, true, querySearch);
                                elSortVerified.innerHTML = `<span class="ycs-creator-verified_icon">✔</span> ${iconSortDown()}`;
                            }

                        }

                    } else if (param?.random) {

                        const randomComment = getRandomComment(comments);
                        resultSearch = randomComment;
                        renderComment(selector, resultSearch, true, querySearch);

                        console.log('Get Random COMMENT: ', randomComment);


                    } else if (param?.timestamp) {

                        (options as any).keys = [
                            'commentRenderer.isTimeLine'
                        ];

                        console.log('COMMENT TIMELINE SEARCH');

                        const fuse = new Fuse(comments, options);
                        resultSearch = fuse.search('timeline') as ICommentsFuseResult[];

                        if (resultSearch.length > 0) {

                            console.log('timestamp before: ', resultSearch);

                            resultSearch?.sort((firstItem, secondItem) => {

                                return firstItem.refIndex - secondItem.refIndex;

                            });

                            console.log('timestamp after: ', resultSearch);

                            const elSortTimeStamp = document.getElementById('ycs_btn_timestamps') as HTMLElement;
                            const sortType = elSortTimeStamp.dataset.sort as 'newest' | 'oldest';

                            if (sortType === 'newest') {
                                renderComment(selector, resultSearch, true, querySearch);

                                elSortTimeStamp.dataset.sort = 'oldest';
                                elSortTimeStamp.innerHTML = `Time stamps ${iconSortDown()}`;
                                elSortTimeStamp.title = 'Show comments, replies, chat with time stamps (Newest)';

                            } else if (sortType === 'oldest') {
                                renderComment(selector, resultSearch?.reverse(), true, querySearch);

                                elSortTimeStamp.dataset.sort = 'newest';
                                elSortTimeStamp.innerHTML = `Time stamps ${iconSortUp()}`;
                                elSortTimeStamp.title = 'Show comments, replies, chat with time stamps (Oldest)';

                            } else {
                                renderComment(selector, resultSearch, true, querySearch);
                                elSortTimeStamp.innerHTML = `Time stamps ${iconSortDown()}`;
                            }

                        }

                    } else if (param?.sortFirst) {

                        const firstComments = filterNewestFirst(comments) as ICommentsFuseResult[];
                        resultSearch = firstComments;

                        if (resultSearch.length > 0) {

                            const elSortAll = document.getElementById('ycs_btn_sort_first') as HTMLElement;
                            const sortType = elSortAll.dataset.sort as 'newest' | 'oldest';

                            if (sortType === 'newest') {
                                renderComment(selector, resultSearch, true, querySearch);

                                elSortAll.dataset.sort = 'oldest';
                                elSortAll.innerHTML = `All ${iconSortDown()}`;
                                elSortAll.title = 'Show all comments, chat, video transcript sorted by date (Newest)';

                                // markTextComment(selector, querySearch);
                            } else if (sortType === 'oldest') {
                                renderComment(selector, resultSearch?.reverse(), true, querySearch);

                                elSortAll.dataset.sort = 'newest';
                                elSortAll.innerHTML = `All ${iconSortUp()}`;
                                elSortAll.title = 'Show all comments, chat, video transcript sorted by date (Oldest)';

                            } else {
                                renderComment(selector, resultSearch, true, querySearch);
                                elSortAll.innerHTML = `All ${iconSortDown()}`;
                            }

                            console.log('Get First COMMENT: ', firstComments);

                        }

                    } else {
                        const fuse = new Fuse(comments, options);
                        resultSearch = fuse.search(querySearch.trim()) as ICommentsFuseResult[];
                        renderComment(selector, resultSearch, true, querySearch);
                    }

                    console.log('SEARCH COMMENTS QUERY: ', querySearch);
                    // const resultSearch = fuse.search(querySearch.trim()) as Comments[];
                    console.log('AFTER FUSE SEARCH RESULT: ', resultSearch);

                    console.log('Fuse search: ', resultSearch);

                    const nodeTotalSearchResult = document.getElementById('ycs-search-total-result');

                    if (nodeTotalSearchResult) {
                        nodeTotalSearchResult.innerText = `(Comments) Found: ${resultSearch.length}`;
                    }

                    countSearchComments.comments = resultSearch.length;

                    console.log('RESULT SEARCH: ', resultSearch);

                    const elsCommentOpenReply = document.getElementById('ycs_wrap_comments');

                    if (elsCommentOpenReply) {

                        elsCommentOpenReply.addEventListener('click', (e) => {

                            try {

                                console.log('EVENT CLICK FOR REPLY: ', e);
                                if ((e.target as HTMLElement)?.classList?.contains('ycs-open-comment')) {

                                    const refID = parseInt(((e.target as HTMLElement).getAttribute('id') as string), 10);
                                    console.log('refID: ', refID);

                                    const reply = (e.target as HTMLElement).closest('.ycs-render-comment');

                                    console.log('reply: ', reply);

                                    if (reply && refID && !document.getElementById('ycs-com-' + refID)) {

                                        try {

                                            const com = { item: (comments[refID] as any).originComment, refIndex: refID };

                                            const wrap = document.createElement('div');
                                            wrap.id = 'ycs-com-' + refID.toString();
                                            wrap.className = wrap.id;

                                            reply.insertAdjacentElement('beforebegin', wrap);

                                            renderComment('#' + wrap.id, [com], true, querySearch);

                                            reply.classList.add('ycs-oc-ml');

                                            let toReplyAuthor;
                                            if ((comments[refID] as any)?.commentRenderer?.contentText?.runs?.length > 0) {
                                                for (const msg of (comments[refID] as any).commentRenderer.contentText.runs) {
                                                    try {

                                                        if (msg.navigationEndpoint?.browseEndpoint?.canonicalBaseUrl) {
                                                            toReplyAuthor = msg.navigationEndpoint?.browseEndpoint?.canonicalBaseUrl;
                                                            break;
                                                        }

                                                    } catch (err) {
                                                        console.error(err);
                                                        continue;
                                                    }
                                                }
                                            }

                                            const replyAuthor = [];
                                            if (toReplyAuthor) {

                                                for (const auth of comments) {

                                                    try {

                                                        if ((auth as any).typeComment === 'R' && (auth as any).originComment === (comments[refID] as any).originComment &&
                                                            (auth as any).commentRenderer?.authorEndpoint?.browseEndpoint?.canonicalBaseUrl === toReplyAuthor) {
                                                            replyAuthor.push({
                                                                item: auth,
                                                                refIndex: refID
                                                            });
                                                        }

                                                    } catch (err) {
                                                        console.error(err);
                                                        continue;
                                                    }

                                                }

                                            }

                                            if (replyAuthor.length > 0) {
                                                console.log('replyAuthor: ', replyAuthor);
                                                const wrapToReply = document.createElement('div');
                                                wrapToReply.id = 'ycs-com-rauth-' + refID.toString();
                                                wrapToReply.className = `ycs-com-${refID} ycs-oc-ml`;
                                                reply.insertAdjacentElement('beforebegin', wrapToReply);

                                                renderComment('#' + wrapToReply.id, replyAuthor, false, querySearch);

                                            }

                                            (e.target as HTMLElement).innerHTML = `${iconCollapse()}`;
                                            (e.target as HTMLElement).title = 'Close the comment to the reply here.';

                                        } catch (err) {
                                            console.error(err);
                                        }

                                    } else if (reply && refID && document.getElementById('ycs-com-' + refID)) {
                                        removeNodeList('.ycs-com-' + refID);

                                        reply.classList.remove('ycs-oc-ml');
                                        (e.target as HTMLElement).innerHTML = `${iconExpand()}`;
                                        (e.target as HTMLElement).title = 'Open the comment to the reply here.';
                                    }

                                } else if ((e.target as HTMLElement)?.classList?.contains('ycs-gotochat-video')) {
                                    e.preventDefault();

                                    const elFrameVideo: HTMLVideoElement = document.getElementsByTagName('video')[0];

                                    if (elFrameVideo) {

                                        const ms = (e.target as HTMLElement).dataset.offsetvideo;

                                        console.log('MS: ', ms);

                                        if (ms) {
                                            elFrameVideo.currentTime = parseInt(ms);
                                        }
                                    }

                                } else if ((e.target as HTMLElement)?.classList?.contains('ycs-open-reply')) {

                                    const id = (e.target as HTMLElement).dataset.idcom;

                                    const wrap = (e.target as HTMLElement).closest('.ycs-render-comment');
                                    console.log('WRAP ELEMENT: ', wrap);

                                    if (wrap?.querySelector(`.ycs-com-replies-${id}`)) {

                                        const replies = wrap.querySelector(`.ycs-com-replies-${id}`);
                                        replies?.remove();

                                        (e.target as HTMLElement).innerHTML = '+';
                                        (e.target as HTMLElement).title = 'Open replies to the comment';

                                        return;
                                    }

                                    const repls = [];
                                    if (id) {

                                        let index: number | undefined;

                                        for (const [i, o] of comments.entries()) {

                                            try {

                                                // console.log(i, o);
                                                if ((o as any).commentRenderer?.commentId === id) {
                                                    index = i;
                                                    break;
                                                }

                                            } catch (err) {
                                                console.error(err);
                                                continue;
                                            }

                                        }

                                        console.log('INDEX: ', index);


                                        if (Number.isInteger(index) && (index as number) >= 0) {
                                            for (const c of comments) {

                                                try {

                                                    if (comments[index as number] === (c as any).originComment) {
                                                        repls.push({
                                                            item: c,
                                                            refIndex: id
                                                        });
                                                    }

                                                } catch (err) {
                                                    console.error(err);
                                                    continue;
                                                }
                                            }
                                        }
                                    }

                                    if (repls.length > 0) {

                                        const reply = (e.target as HTMLElement).closest('.ycs-render-comment');

                                        console.log('reply: ', reply);

                                        const wrapToReply = document.createElement('div');
                                        wrapToReply.id = 'ycs-com-replies-' + id;
                                        wrapToReply.className = `ycs-com-replies-${id} ycs-oc-ml ycs-com-replies ycs-com-rp`;
                                        reply?.insertAdjacentElement('beforeend', wrapToReply);

                                        renderComment(wrapToReply, repls, false, querySearch);

                                        (e.target as HTMLElement).innerHTML = String.fromCharCode(8722);
                                        (e.target as HTMLElement).title = 'Close replies to the comment';
                                    }

                                    console.log('ID: ', id);
                                    console.log('e.target: ', e.target);

                                }

                            } catch (err) {
                                console.error(err);
                            }

                        });

                    }

                } catch (err) {
                    console.error(err);
                }

            };

            const searchCommentsChat = (selector: string, param?: IParamSearch): void => {

                try {

                    if (param?.likes || param?.replied || param?.random || param?.heart) return;

                    if (commentsChat && commentsChat.size > 0) {

                        const elSearchRes = document.querySelector(selector);
                        const inputSearch = document.getElementById('ycs-input-search');

                        const cmntsChat = [...commentsChat.values()];
                        console.log('cmntsChat: ', cmntsChat);
                        let querySearch = '';

                        if (inputSearch) {
                            querySearch = (inputSearch as HTMLInputElement).value;
                        }

                        console.log('query Search for CHAT: ', querySearch);

                        if (elSearchRes) elSearchRes.textContent = '';

                        const elExtSearchTitle = document.getElementById('ycs_extended_search_title') as HTMLInputElement;
                        const elExtSearchMain = document.getElementById('ycs_extended_search_main') as HTMLInputElement;

                        let fuseOpt = fuseOptions;
                        let keysOpt = [
                            'replayChatItemAction.actions.addChatItemAction.item.liveChatTextMessageRenderer.authorName.simpleText',
                            'replayChatItemAction.actions.addChatItemAction.item.liveChatTextMessageRenderer.message.fullText'
                        ];

                        if (elExtSearch.checked) {
                            fuseOpt = JSON.parse(JSON.stringify(fuseOptions));
                            fuseOpt.useExtendedSearch = true;

                            if (elExtSearchTitle.checked) {
                                keysOpt = [
                                    'replayChatItemAction.actions.addChatItemAction.item.liveChatTextMessageRenderer.authorName.simpleText'
                                ];
                            }

                            if (elExtSearchMain.checked) {
                                keysOpt = [
                                    'replayChatItemAction.actions.addChatItemAction.item.liveChatTextMessageRenderer.message.fullText'
                                ];
                            }

                        }

                        const options: object = {
                            ...fuseOpt,
                            keys: keysOpt
                        };

                        let resultSearch: ICommentsFuseResult[] = [];

                        if (param?.author) {

                            const cmntsAuthor = filterAuthorChat(cmntsChat);
                            resultSearch = cmntsAuthor;
                            console.log('resultSearch chat author: ', resultSearch);

                            if (resultSearch?.length > 0) {

                                console.log('author Chat before: ', resultSearch);

                                resultSearch?.sort((firstItem, secondItem) => {

                                    return firstItem.refIndex - secondItem.refIndex;

                                });

                                console.log('author Chat after: ', resultSearch);

                                const elSortAuthor = document.getElementById('ycs_btn_author') as HTMLElement;
                                const sortType = elSortAuthor.dataset.sortChat as 'newest' | 'oldest';

                                if (sortType === 'newest') {
                                    renderCommentChat(selector, resultSearch, querySearch);

                                    elSortAuthor.dataset.sortChat = 'oldest';
                                    elSortAuthor.innerHTML = `Author ${iconSortDown()}`;
                                    elSortAuthor.title = 'Show comments, replies, chat from the author (Newest)';

                                } else if (sortType === 'oldest') {
                                    renderCommentChat(selector, resultSearch?.reverse(), querySearch);

                                    elSortAuthor.dataset.sortChat = 'newest';
                                    elSortAuthor.innerHTML = `Author ${iconSortUp()}`;
                                    elSortAuthor.title = 'Show comments, replies, chat from the author (Oldest)';

                                } else {
                                    renderCommentChat(selector, resultSearch, querySearch);
                                }

                            }

                            console.log('COMMENT CHAT authorIsChannelOwner SEARCH: ', cmntsAuthor);

                        } else if (param?.donated) {

                            const cmntsDonated = filterDonatedChat(cmntsChat);
                            resultSearch = cmntsDonated;

                            if (resultSearch?.length > 0) {

                                console.log('donated Chat before: ', resultSearch);

                                resultSearch?.sort((firstItem, secondItem) => {

                                    return firstItem.refIndex - secondItem.refIndex;

                                });

                                console.log('donated Chat after: ', resultSearch);

                                const elSortDonated = document.getElementById('ycs_btn_donated') as HTMLElement;
                                const sortType = elSortDonated.dataset.sortChat as 'newest' | 'oldest';

                                if (sortType === 'newest') {
                                    renderCommentChat(selector, resultSearch, querySearch);

                                    elSortDonated.dataset.sortChat = 'oldest';
                                    elSortDonated.innerHTML = `Donated ${iconSortDown()}`;
                                    elSortDonated.title = 'Show chat comments from users who have donated (Newest)';

                                } else if (sortType === 'oldest') {
                                    renderCommentChat(selector, resultSearch?.reverse(), querySearch);

                                    elSortDonated.dataset.sortChat = 'newest';
                                    elSortDonated.innerHTML = `Donated ${iconSortUp()}`;
                                    elSortDonated.title = 'Show chat comments from users who have donated (Oldest)';

                                } else {
                                    renderCommentChat(selector, resultSearch, querySearch);
                                    elSortDonated.innerHTML = `Donated ${iconSortDown()}`;
                                }

                            }

                            console.log('cmntsDonated: ', cmntsDonated);

                        } else if (param?.members) {

                            const cmntsMembers = filterMembersChat(cmntsChat);
                            resultSearch = cmntsMembers;

                            if (resultSearch?.length > 0) {

                                console.log('member Chat before: ', resultSearch);

                                resultSearch?.sort((firstItem, secondItem) => {

                                    return firstItem.refIndex - secondItem.refIndex;

                                });

                                console.log('member Chat after: ', resultSearch);

                                const elSortMember = document.getElementById('ycs_btn_members') as HTMLElement;
                                const sortType = elSortMember.dataset.sortChat as 'newest' | 'oldest';

                                if (sortType === 'newest') {
                                    renderCommentChat(selector, resultSearch, querySearch);

                                    elSortMember.dataset.sortChat = 'oldest';
                                    elSortMember.innerHTML = `Members ${iconSortDown()}`;
                                    elSortMember.title = 'Show comments, replies, chat from channel members (Newest)';

                                } else if (sortType === 'oldest') {
                                    renderCommentChat(selector, resultSearch?.reverse(), querySearch);

                                    elSortMember.dataset.sortChat = 'newest';
                                    elSortMember.innerHTML = `Members ${iconSortUp()}`;
                                    elSortMember.title = 'Show comments, replies, chat from channel members (Oldest)';

                                } else {
                                    renderCommentChat(selector, resultSearch, querySearch);
                                }

                                console.log('COMMENT CHAT cmntsMembers: ', cmntsMembers);
                            }

                        } else if (param?.timestamp) {

                            (options as any).keys = [
                                'replayChatItemAction.actions.addChatItemAction.item.liveChatTextMessageRenderer.isTimeLine'
                            ];

                            console.log('CHAT TIMELINE SEARCH');

                            const fuse = new Fuse(cmntsChat, options);
                            resultSearch = fuse.search('timeline') as ICommentsFuseResult[];

                            if (resultSearch?.length > 0) {

                                console.log('timestamp CHAT before: ', resultSearch);

                                resultSearch?.sort((firstItem, secondItem) => {

                                    return firstItem.refIndex - secondItem.refIndex;

                                });

                                console.log('timestamp CHAT after: ', resultSearch);

                                const elSortTimeStamp = document.getElementById('ycs_btn_timestamps') as HTMLElement;
                                const sortType = elSortTimeStamp.dataset.sortChat as 'newest' | 'oldest';

                                if (sortType === 'newest') {
                                    renderCommentChat(selector, resultSearch, querySearch);

                                    elSortTimeStamp.dataset.sortChat = 'oldest';
                                    elSortTimeStamp.innerHTML = `Time stamps ${iconSortDown()}`;
                                    elSortTimeStamp.title = 'Show comments, replies, chat with time stamps (Newest)';

                                } else if (sortType === 'oldest') {
                                    renderCommentChat(selector, resultSearch?.reverse(), querySearch);

                                    elSortTimeStamp.dataset.sortChat = 'newest';
                                    elSortTimeStamp.innerHTML = `Time stamps ${iconSortUp()}`;
                                    elSortTimeStamp.title = 'Show comments, replies, chat with time stamps (Oldest)';

                                } else {
                                    renderCommentChat(selector, resultSearch, querySearch);
                                }

                            }

                        } else if (param?.sortFirst) {

                            const cmntsChatAll = filterChatNewestFirst(commentsChat) as ICommentsFuseResult[];
                            resultSearch = cmntsChatAll;

                            if (resultSearch?.length > 0) {

                                console.log('All Chat before: ', resultSearch);

                                resultSearch?.sort((firstItem, secondItem) => {

                                    return firstItem.refIndex - secondItem.refIndex;

                                });

                                console.log('All Chat after: ', resultSearch);

                                const elSortChatAll = document.getElementById('ycs_btn_sort_first') as HTMLElement;
                                const sortType = elSortChatAll.dataset.sortChat as 'newest' | 'oldest';

                                if (sortType === 'newest') {
                                    renderCommentChat(selector, resultSearch, querySearch);

                                    elSortChatAll.dataset.sortChat = 'oldest';
                                    elSortChatAll.innerHTML = `All ${iconSortDown()}`;
                                    elSortChatAll.title = 'Show all comments, chat, video transcript sorted by date (Newest)';

                                } else if (sortType === 'oldest') {
                                    renderCommentChat(selector, resultSearch?.reverse(), querySearch);

                                    elSortChatAll.dataset.sortChat = 'newest';
                                    elSortChatAll.innerHTML = `All ${iconSortUp()}`;
                                    elSortChatAll.title = 'Show all comments, chat, video transcript sorted by date (Oldest)';

                                } else {
                                    renderCommentChat(selector, resultSearch, querySearch);
                                }

                            }

                        } else if (param?.verified) {

                            const cmntsChatAll = filterVerifiedChatComments(commentsChat) as ICommentsFuseResult[];
                            resultSearch = cmntsChatAll;

                            console.log('cmntsChatAll, filterVerifiedChatComments: ', resultSearch);

                            if (resultSearch?.length > 0) {

                                console.log('All filterVerifiedChatComments before: ', resultSearch);

                                resultSearch?.sort((firstItem, secondItem) => {

                                    return firstItem.refIndex - secondItem.refIndex;

                                });

                                console.log('All filterVerifiedChatComments after: ', resultSearch);

                                const elSortVerified = document.getElementById('ycs_btn_verified') as HTMLElement;
                                const sortType = elSortVerified.dataset.sortChat as 'newest' | 'oldest';

                                if (sortType === 'newest') {
                                    renderCommentChat(selector, resultSearch, querySearch);

                                    elSortVerified.dataset.sortChat = 'oldest';
                                    elSortVerified.innerHTML = `<span class="ycs-creator-verified_icon">✔</span> ${iconSortDown()}`;
                                    elSortVerified.title = 'Show comments,  replies and chat from a verified authors (Newest)';

                                } else if (sortType === 'oldest') {
                                    renderCommentChat(selector, resultSearch?.reverse(), querySearch);

                                    elSortVerified.dataset.sortChat = 'newest';
                                    elSortVerified.innerHTML = `<span class="ycs-creator-verified_icon">✔</span> ${iconSortUp()}`;
                                    elSortVerified.title = 'Show comments,  replies and chat from a verified authors (Oldest)';

                                } else {
                                    renderCommentChat(selector, resultSearch, querySearch);
                                }

                            }

                        } else if (param?.links) {

                            const cmntsChatAll = filterLinksChatComments(commentsChat) as ICommentsFuseResult[];
                            resultSearch = cmntsChatAll;

                            console.log('cmntsChatAll, filterLinksChatComments: ', resultSearch);

                            if (resultSearch?.length > 0) {

                                console.log('All filterLinksChatComments before: ', resultSearch);

                                resultSearch?.sort((firstItem, secondItem) => {

                                    return firstItem.refIndex - secondItem.refIndex;

                                });

                                console.log('All filterLinksChatComments after: ', resultSearch);

                                const elSortVerified = document.getElementById('ycs_btn_links') as HTMLElement;
                                const sortType = elSortVerified.dataset.sortChat as 'newest' | 'oldest';

                                if (sortType === 'newest') {
                                    renderCommentChat(selector, resultSearch, querySearch);

                                    elSortVerified.dataset.sortChat = 'oldest';
                                    elSortVerified.innerHTML = `Links ${iconSortDown()}`;
                                    elSortVerified.title = 'Shows links in comments, replies, chat, video transcript (Newest)';

                                } else if (sortType === 'oldest') {
                                    renderCommentChat(selector, resultSearch?.reverse(), querySearch);

                                    elSortVerified.dataset.sortChat = 'newest';
                                    elSortVerified.innerHTML = `Links ${iconSortUp()}`;
                                    elSortVerified.title = 'Shows links in comments, replies, chat, video transcript (Oldest)';

                                } else {
                                    renderCommentChat(selector, resultSearch, querySearch);
                                }

                            }

                        } else {
                            const fuse = new Fuse(cmntsChat, options);
                            resultSearch = fuse.search(querySearch.trim()) as ICommentsFuseResult[];

                            renderCommentChat(selector, resultSearch, querySearch);
                        }

                        console.log('BEFORE SEARCH CHAT: ', cmntsChat);

                        console.log('FUSE SEARCH CHAT: ', resultSearch);

                        const nodeTotalSearchResult = document.getElementById('ycs-search-total-result');

                        if (nodeTotalSearchResult) {
                            nodeTotalSearchResult.innerText = `(Chat replay) Found: ${resultSearch.length}`;
                        }
                        countSearchComments.commentsChat = resultSearch.length;

                        const elsGotoChatVideo = document.getElementById('ycs_wrap_comments_chat');

                        elsGotoChatVideo?.addEventListener('click', (e) => {

                            try {

                                if ((e.target as HTMLElement)?.classList?.contains('ycs-gotochat-video')) {
                                    const elFrameVideo: HTMLVideoElement = document.getElementsByTagName('video')[0];

                                    e.preventDefault();

                                    if (elFrameVideo) {

                                        const ms = (e.target as HTMLElement).dataset.offsetvideo;

                                        console.log('MS: ', ms);

                                        if (ms) {
                                            elFrameVideo.currentTime = (parseInt(ms) / 1000);
                                        }
                                    }
                                }


                            } catch (err) {
                                console.error(err);
                                return;
                            }

                        });

                    }

                } catch (err) {
                    console.error(err);
                }

            };

            const searchCommentsTrVideo = (selector: string, param?: IParamSearch): void => {

                try {

                    if (commentsTrVideo && (commentsTrVideo as any).actions[0].updateEngagementPanelAction.content.transcriptRenderer.body.transcriptBodyRenderer.cueGroups.length > 0) {

                        const elSearchRes = document.querySelector(selector);
                        const inputSearch = document.getElementById('ycs-input-search');

                        const cmntsTrVideo = (commentsTrVideo as any).actions[0].updateEngagementPanelAction.content.transcriptRenderer.body.transcriptBodyRenderer.cueGroups;

                        let querySearch = '';
                        if (inputSearch) {
                            querySearch = (inputSearch as HTMLInputElement).value;
                        }

                        console.log('query Search for TRVIDEO: ', querySearch);

                        if (elSearchRes) elSearchRes.textContent = '';

                        const elExtSearchTitle = document.getElementById('ycs_extended_search_title') as HTMLInputElement;
                        const elExtSearchMain = document.getElementById('ycs_extended_search_main') as HTMLInputElement;

                        let fuseOpt = fuseOptions;
                        let keysOpt = [
                            'transcriptCueGroupRenderer.cues.transcriptCueRenderer.cue.simpleText',
                            'transcriptCueGroupRenderer.formattedStartOffset.simpleText'
                        ];

                        if (elExtSearch.checked) {
                            fuseOpt = JSON.parse(JSON.stringify(fuseOptions));
                            fuseOpt.useExtendedSearch = true;

                            if (elExtSearchTitle.checked) {
                                keysOpt = [
                                    'transcriptCueGroupRenderer.formattedStartOffset.simpleText'
                                ];
                            }

                            if (elExtSearchMain.checked) {
                                keysOpt = [
                                    'transcriptCueGroupRenderer.cues.transcriptCueRenderer.cue.simpleText'
                                ];
                            }

                        }

                        const options: object = {
                            ...fuseOpt,
                            keys: keysOpt
                        };

                        console.log('BEFORE SEARCH TRVIDEO: ', cmntsTrVideo);

                        let resultSearch: any[] = [];

                        if (param) {

                            if (param?.links) {
    
                                const trpVideo = filterLinksTrpVideoComments(cmntsTrVideo) as ICommentsFuseResult[];
                                resultSearch = trpVideo;
    
                                console.log('filterLinksTrpVideoComments resultSearch: ', resultSearch);
    
                                if (resultSearch?.length > 0) {
    
                                    console.log('All filterLinksTrpVideoComments before: ', resultSearch);
    
                                    resultSearch?.sort((firstItem, secondItem) => {
    
                                        return firstItem.refIndex - secondItem.refIndex;
    
                                    });
    
                                    console.log('All filterLinksTrpVideoComments after: ', resultSearch);
    
                                    const elSortLinksTrpVideo = document.getElementById('ycs_btn_links') as HTMLElement;
                                    const sortType = elSortLinksTrpVideo.dataset.sortTrp as 'newest' | 'oldest';
    
                                    if (sortType === 'newest') {
                                        renderCommentTrVideo(selector, resultSearch, querySearch);
    
                                        elSortLinksTrpVideo.dataset.sortTrp = 'oldest';
                                        elSortLinksTrpVideo.innerHTML = `Links ${iconSortDown()}`;
                                        elSortLinksTrpVideo.title = 'Shows links in comments, replies, chat, video transcript (Newest)';
    
                                    } else if (sortType === 'oldest') {
                                        renderCommentTrVideo(selector, resultSearch?.reverse(), querySearch);
    
                                        elSortLinksTrpVideo.dataset.sortTrp = 'newest';
                                        elSortLinksTrpVideo.innerHTML = `Links ${iconSortUp()}`;
                                        elSortLinksTrpVideo.title = 'Shows links in comments, replies, chat, video transcript (Oldest)';
    
                                    } else {
                                        renderCommentTrVideo(selector, resultSearch, querySearch);
                                    }
    
                                }
    
                            } else if (param?.sortFirst) {

                                const trpVideo = filterAllTrpVideoComments(cmntsTrVideo) as ICommentsFuseResult[];
                                resultSearch = trpVideo;
    
                                console.log('filterAllTrpVideoComments resultSearch: ', resultSearch);
    
                                if (resultSearch?.length > 0) {
    
                                    console.log('All filterAllTrpVideoComments before: ', resultSearch);
    
                                    resultSearch?.sort((firstItem, secondItem) => {
    
                                        return firstItem.refIndex - secondItem.refIndex;
    
                                    });
    
                                    console.log('All filterAllTrpVideoComments after: ', resultSearch);
    
                                    const elSortAllTrpVideo = document.getElementById('ycs_btn_sort_first') as HTMLElement;
                                    const sortType = elSortAllTrpVideo.dataset.sortTrp as 'newest' | 'oldest';
    
                                    if (sortType === 'newest') {
                                        renderCommentTrVideo(selector, resultSearch, querySearch);
    
                                        elSortAllTrpVideo.dataset.sortTrp = 'oldest';
                                        elSortAllTrpVideo.innerHTML = `All ${iconSortDown()}`;
                                        elSortAllTrpVideo.title = 'Show all comments, chat, video transcript sorted by date (Newest)';
    
                                    } else if (sortType === 'oldest') {
                                        renderCommentTrVideo(selector, resultSearch?.reverse(), querySearch);
    
                                        elSortAllTrpVideo.dataset.sortTrp = 'newest';
                                        elSortAllTrpVideo.innerHTML = `All ${iconSortUp()}`;
                                        elSortAllTrpVideo.title = 'Show all comments, chat, video transcript sorted by date (Oldest)';
    
                                    } else {
                                        renderCommentTrVideo(selector, resultSearch, querySearch);
                                    }
    
                                }

                            } else {
                                return;
                            }

                        } else {
                            const fuse = new Fuse(cmntsTrVideo, options);
                            resultSearch = fuse.search(querySearch.trim()) as [];

                            renderCommentTrVideo(selector, resultSearch, querySearch);
                        }

                        console.log('FUSE SEARCH TR VIDEO: ', resultSearch);

                        const nodeTotalSearchResult = document.getElementById('ycs-search-total-result');

                        if (nodeTotalSearchResult) {
                            nodeTotalSearchResult.innerText = `(Tr. video) Found: ${resultSearch.length}`;
                        }
                        countSearchComments.commentsTrVideo = resultSearch.length;

                        const elsGotoVideo = document.getElementById('ycs_wrap_comments_trvideo');

                        elsGotoVideo?.addEventListener('click', (e) => {

                            try {
                                console.log('TR EVENT CLICK: ', e);
                                console.log('TR EVENT CLICK currentTarget: ', e.currentTarget);
                                if ((e.target as HTMLElement)?.classList?.contains('ycs-goto-video')) {
                                    e.preventDefault();

                                    console.log('EVENT CLICK: ', e);

                                    const elFrameVideo: HTMLVideoElement = document.getElementsByTagName('video')[0];

                                    console.log('elFrameVideo: ', elFrameVideo);

                                    if (elFrameVideo) {

                                        const ms = (e.target as HTMLElement).dataset.offsetvideo;

                                        console.log('MS: ', ms);

                                        if (ms) {
                                            elFrameVideo.currentTime = (parseInt(ms) / 1000);
                                        }
                                    }
                                }


                            } catch (err) {
                                console.error(err);
                                return;
                            }

                        });

                    }

                } catch (err) {
                    console.error(err);
                }

            };

            const searchCommentsAll = (selector: string, param?: IParamSearch): void => {

                const elSearchAll = document.querySelector(selector);
                const nodeTotalSearchResult = document.getElementById('ycs-search-total-result');

                if (nodeTotalSearchResult) {
                    nodeTotalSearchResult?.classList.add('ycs-hidden');
                }

                if (elSearchAll) elSearchAll.textContent = '';

                const elWrapComments = document.createElement('div');
                elWrapComments.id = 'ycs_allsearch__wrap_comments';

                const elWrapCommentsChat = document.createElement('div');
                elWrapCommentsChat.id = 'ycs_allsearch__wrap_comments_chat';

                const elWrapCommentsTrVideo = document.createElement('div');
                elWrapCommentsTrVideo.id = 'ycs_allsearch__wrap_comments_trvideo';

                console.log('searchCommentsAll selector, param: ', selector, param);

                try {

                    if (comments.length > 0) {

                        console.log('comments!!!!!!', comments);
                        elSearchAll?.appendChild(elWrapComments);
                        searchComments('#ycs_allsearch__wrap_comments', param);

                    }

                    if (commentsChat && commentsChat.size > 0) {

                        elSearchAll?.appendChild(elWrapCommentsChat);
                        searchCommentsChat('#ycs_allsearch__wrap_comments_chat', param);

                    }

                    if (commentsTrVideo &&
                        (wrapTryCatch(() => (commentsTrVideo as any).actions[0].updateEngagementPanelAction.content.transcriptRenderer.body.transcriptBodyRenderer.cueGroups.length) as any > 0)) {

                        console.log('PARAM TR VIDEO!!!!!: ', param);
                        elSearchAll?.appendChild(elWrapCommentsTrVideo);
                        searchCommentsTrVideo('#ycs_allsearch__wrap_comments_trvideo', param);

                    }

                    if (nodeTotalSearchResult) {
                        const resTotalSearch = countSearchComments.comments + countSearchComments.commentsChat + countSearchComments.commentsTrVideo;

                        if (param?.timestamp) {
                            nodeTotalSearchResult.innerText = `Time stamps, found: ${resTotalSearch}`;
                        } else if (param?.author) {
                            nodeTotalSearchResult.innerText = `Author, found: ${resTotalSearch}`;
                        } else if (param?.heart) {
                            nodeTotalSearchResult.innerText = `Heart, found: ${resTotalSearch}`;
                        } else if (param?.verified) {
                            nodeTotalSearchResult.innerText = `Verified authors, found: ${resTotalSearch}`;
                        } else if (param?.links) {
                            nodeTotalSearchResult.innerText = `Links, found: ${resTotalSearch}`;
                        } else if (param?.likes) {
                            nodeTotalSearchResult.innerText = `Likes, found: ${resTotalSearch}`;
                        } else if (param?.replied) {
                            nodeTotalSearchResult.innerText = `Replied, found: ${resTotalSearch}`;
                        } else if (param?.members) {
                            nodeTotalSearchResult.innerText = `Members, found: ${resTotalSearch}`;
                        } else if (param?.donated) {
                            nodeTotalSearchResult.innerText = `Donated, found: ${resTotalSearch}`;
                        } else if (param?.random) {
                            nodeTotalSearchResult.innerText = `Random, found: ${resTotalSearch}`;
                        } else if (param?.sortFirst) {
                            nodeTotalSearchResult.innerText = `All comments, found: ${resTotalSearch}`;
                        } else {
                            nodeTotalSearchResult.innerText = `(All) Found: ${resTotalSearch}`;
                        }
                        nodeTotalSearchResult?.classList.remove('ycs-hidden');
                    }

                } catch (err) {
                    console.error(err);
                }

            };

            if (btnSearch) {

                btnSearch.addEventListener('click', (): void => {

                    removeClass(elsBtnPanel, 'ycs_btn_active');

                    const elSelectOptSearch = document.getElementById('ycs_search_select') as HTMLSelectElement;

                    console.log('click');

                    if (elSelectOptSearch) {

                        const selected: ISelectedSearch =
                            elSelectOptSearch?.options[
                                elSelectOptSearch?.options?.selectedIndex
                            ].value as unknown as ISelectedSearch;

                        switch (selected) {
                        case 'comments':
                            console.log('Switch 0');
                            searchComments('#ycs-search-result');
                            break;
                        case 'chat':
                            console.log('Switch 1');
                            searchCommentsChat('#ycs-search-result');
                            break;
                        case 'video':
                            console.log('Switch 2');
                            searchCommentsTrVideo('#ycs-search-result');
                            break;
                        case 'all':
                            console.log('Switch 3');
                            searchCommentsAll('#ycs-search-result');
                            break;
                        default:
                            console.log('Switch default');
                            break;
                        }

                    }

                    return;
                });

            }

            window.postMessage({ type: 'GET_OPTIONS' }, window.location.origin);

            handleMessageEvent = (e): void => {
                console.log('EVENT MESSAGE e: ', e);

                if (e.origin !== window.location.origin) return;
                
                if (e.data?.type === 'YCS_OPTIONS' && e.data?.text) {
                    console.log('YCS_OPTIONS', e.data);

                    const optAutoload = (value: boolean): void => {

                        if (value === true) {
                            elLoadAll?.click();
                        }

                    };

                    const wrapOptAutoload = (value: boolean, opts: any): void => {

                        if (!opts.cache) {
                            optAutoload(value);
                        }

                    };

                    const optHighlightText = (value: boolean): void => {

                        try {

                            GlobalStore.highlightText = value;

                        } catch (err) {
                            console.error(err);
                        }

                    };

                    const optCached = (value: boolean): void => {

                        try {

                            if (!value) return;

                            sendGetCacheInIDB(window.location.href);


                        } catch (err) {
                            console.error(err);
                        }

                    };

                    try {

                        const opts = e.data.text;

                        for (const key of Object.keys(opts)) {

                            switch (key) {

                            case 'autoload':

                                wrapOptAutoload(opts[key], opts);
                                break;

                            case 'highlightText':

                                optHighlightText(opts[key]);
                                break;

                            case 'cache':

                                optCached(opts[key]);
                                break;

                            default:
                                break;
                            }

                        }


                    } catch (err) {
                        console.error(err);
                    }

                }

                if (e.data?.type === 'YCS_CACHE_STORAGE_GET_RESPONSE') {

                    console.log('YCS_CACHE_STORAGE_GET_RESPONSE:', e.data);

                    if (e.data?.body) {

                        try {

                            // Fix IT. This had to be done for the client side. Because the logic in object is the linked links.
                            if (e.data.body.comments.length > 0) {

                                for (const cmnt of e.data.body.comments) {
                                    if (cmnt.typeComment === 'R') {

                                        for (const c of e.data.body.comments) {
                                            if ((c.typeComment === 'C') && (c.commentRenderer.commentId === cmnt.originComment.commentRenderer.commentId)) {
                                                cmnt.originComment = c;
                                                break;
                                            }
                                        }
                                    }
                                }

                                comments = e.data.body.comments;
                            }

                        } catch (err) {
                            console.error(err);
                        }

                        commentsChat = new Map(JSON.parse(e.data.body.commentsChat));
                        commentsTrVideo = e.data.body.commentsTrVideo;

                        const crdate = e.data.body.date;

                        // comments
                        const elStatusCmnts = document.getElementById('ycs_status_cmnt');
                        if (comments.length > 0 && elStatusCmnts) {
                            elStatusCmnts.innerHTML = iconOk();
                        }

                        if ((comments.length > 0) && (elLiveApp.parentNode || elLiveApp.parentElement)) {
                            countComments.comments = comments.length;
                        }

                        const elLoadCmnts = document.getElementById('ycs_cmnts');
                        if (elLoadCmnts) {
                            elLoadCmnts.textContent = `${comments.length}`;
                        }

                        // end comments


                        // chat

                        if (commentsChat && commentsChat.size > 0) {
                            const elLoadChat = document.getElementById('ycs_cmnts_chat') as HTMLElement;
                            const elStatusChat = document.getElementById('ycs_status_chat') as HTMLElement;
                            elLoadChat.textContent = commentsChat.size.toString();
                            elStatusChat.innerHTML = iconOk();
                        }

                        if ((commentsChat && commentsChat.size > 0) && (elLiveApp.parentNode || elLiveApp.parentElement)) {

                            countComments.commentsChat = commentsChat.size;

                        }

                        // end chat


                        // Tr. video

                        if (wrapTryCatch(() => (commentsTrVideo as any)?.actions[0]?.updateEngagementPanelAction?.content?.transcriptRenderer?.body?.transcriptBodyRenderer?.cueGroups?.length > 0)) {

                            const elStatusTrVideo = document.getElementById('ycs_status_trvideo') as HTMLElement;
                            const elLoadTrVideo = document.getElementById('ycs_cmnts_video') as HTMLElement;

                            showLoadComments((commentsTrVideo as any).actions[0].updateEngagementPanelAction.content.transcriptRenderer.body.transcriptBodyRenderer.cueGroups.length, elLoadTrVideo);
                            elStatusTrVideo.innerHTML = iconOk();
                        }

                        if (wrapTryCatch(() => (commentsTrVideo as any)?.actions[0]?.updateEngagementPanelAction?.content?.transcriptRenderer?.body?.transcriptBodyRenderer?.cueGroups?.length > 0) && (elLiveApp.parentNode || elLiveApp.parentElement)) {

                            countComments.commentsTrVideo = (commentsTrVideo as any).actions[0].updateEngagementPanelAction.content.transcriptRenderer.body.transcriptBodyRenderer.cueGroups.length;

                        }

                        // end tr. video

                        const totalCount = countComments.comments + countComments.commentsChat + countComments.commentsTrVideo;
                        sendMsgToBadge('NUMBER_COMMENTS', totalCount);

                        if (elCountComments) {
                            elCountComments.textContent = `(${totalCount})`;
                        }

                        const elTitleInfo = document.getElementById('ycs-count-load') as HTMLElement;

                        elTitleInfo.insertAdjacentHTML('beforeend', `
                            <span class="ycs-title-cache-info" title="${new Date(crdate)}">Cached</span>
                        `);

                    } else {
                        window.postMessage({ type: 'YCS_AUTOLOAD' }, window.location.origin);
                    }

                }

                if (e.data?.type === 'YCS_AUTOLOAD') {
                    elLoadAll?.click();
                }

            };

            window.addEventListener('message', handleMessageEvent);

            initShowBarFAQ();
            initShowViewMode();

            const elExtSearch = document.getElementById('ycs_extended_search') as HTMLInputElement;

            if (elExtSearch) {

                const elExtSearchTitle = document.getElementById('ycs_extended_search_title') as HTMLInputElement;
                const elExtSearchMain = document.getElementById('ycs_extended_search_main') as HTMLInputElement;

                elExtSearch?.addEventListener('click', () => {

                    try {

                        if (elExtSearch.checked) {
                            // fuseOptions.useExtendedSearch = true;
                            

                            if(elExtSearchTitle && elExtSearchMain) {
                                elExtSearchTitle.disabled = false;
                                elExtSearchMain.disabled = false;
                            }

                            // console.log('Ext. search CHECKED: ', fuseOptions.useExtendedSearch);
                        } else {
                            // fuseOptions.useExtendedSearch = false;

                            if(elExtSearchTitle && elExtSearchMain) {
                                elExtSearchTitle.disabled = true;
                                elExtSearchMain.disabled = true;
                            }

                            // console.log('Ext. search UN CHECKED: ', fuseOptions.useExtendedSearch);
                        }
                        
                    } catch (err) {
                        console.error(err);
                    }

                });

            }
        }

        function startObserve(): void {
            let prevUrl = getCleanUrlVideo(window.location.href);
            // console.log('prevUrl First init: ', prevUrl);


            setInterval(() => {

                if (isWatchVideo() && document.querySelector('#meta.style-scope.ytd-watch-flexy') &&
                    (prevUrl !== getCleanUrlVideo(window.location.href))) {
                    prevUrl = getCleanUrlVideo(window.location.href);
                    // console.log('prevUrl After: ', prevUrl);

                    controller.abort();
                    app();

                }

            }, 1000);

        }

        startObserve();

        try {

            if (isWatchVideo()) {
                app();
            }

        } catch (e) {
            console.error(e);
            if (isWatchVideo()) {
                app();
            }

        }
    }

}());